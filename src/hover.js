const vscode = require('vscode')
const path = require('path')
const fs = require('fs')
/**
 * 鼠标悬停提示，当鼠标停在package.json的dependencies或者devDependencies时，
 * 自动显示对应包的名称、版本号和许可协议
 * @param {*} document
 * @param {*} position
 * @param {*} token
 */
function provideHover(document, position, token) {
	const fileName = document.fileName
	const workDir = path.dirname(fileName)
	const wordposition = document.getWordRangeAtPosition(position)
	const word = document.getText(wordposition)
	const line = document.lineAt(position)
	if (line.text.startsWith('//')) {
		return
	}
	let list = [
		{ id: 'loc', name: '玩家正在访问的当前位置' },
		{ id: 'loc.id', name: '当前位置的id' },
		{ id: 'loc.name', name: '当前位置的本地化名称' },
		{ id: 'loc.stars', name: '当前位置的难度（星级）' },
		{ id: 'loc.begin', name: '仅在任一游戏启动时，time为0的时候，第一帧为ture。不包括由衔尾蛇石头自动开始的循环游戏。用来初始化变量' },
		{ id: 'loc.loop', name: '由衔尾蛇石头自动开始的循环游戏启动时，第一帧为ture' },
		{ id: 'loc.bestTime', name: '当前位置的最佳完成时间（你的最高记录）' },
		{
			id: 'loc.averageTime',
			name: ' 当前位置的平均完成时间。一个地点的平均时间是以加权方式计算的，其中最新的完成时间价值更高，而较老的时间价值随着时间的增长而逐渐减少'
		},
		{ id: 'foe', name: '当前被玩家选为目标的敌人' },
		{ id: 'foe.distance', name: '玩家与目标敌人的距离' },
		{ id: 'foe.count', name: '40单位（距离）内敌人的数量' },
		{ id: 'foe.hp', name: '目标敌人的当前生命值' },
		{ id: 'foe.maxhp', name: '目标敌人的最大生命值' },
		{ id: 'foe.armor', name: '目标敌人的当前护甲' },
		{ id: 'foe.maxarmor', name: '目标敌人的最大护甲' },
		{ id: 'foe.state', name: '代表目标敌人当前状态的数字' },
		{ id: 'foe.time', name: ' 目标敌人当前状态下的已用帧数' },
		{ id: 'foe.level', name: ' 目标敌人的等级' },
		{ id: 'foe.name', name: ' 目标敌人的本地化名称' },
		{ id: 'item', name: '装备类（左右手武器，正在酿造的药水）' },
		{ id: 'item.left', name: '装备在左手的物品' },
		{ id: 'item.right', name: '装备在右手的物品' },
		{ id: 'item.potion', name: '目前正在酿造的药剂。如果坩埚上启用了自动重新加注，则包括“自动”' },
		{ id: 'harvest', name: '下一个可收获的物体，例如大树和巨石' },
		{ id: 'harvest.distance', name: '玩家与最近可收获物体之间的距离' },
		{ id: 'pickup', name: '当前被玩家选为目标的拾取物品' },
		{ id: 'pickup.distance', name: '玩家与目标拾取物品的距离' },
		{ id: 'time', name: '地区的当前帧号' },
		{ id: 'time.year', name: '年（取电脑本地时间）' },
		{ id: 'time.month', name: '月（取电脑本地时间）' },
		{ id: 'time.day', name: '天（取电脑本地时间）' },
		{ id: 'time.hour', name: '小时（取电脑本地时间）' },
		{ id: 'time.minute', name: '分钟（取电脑本地时间）' },
		{ id: 'time.second', name: '秒（取电脑本地时间）' },
		{
			id: 'totaltime',
			name: '游戏的当前帧号。（例如你进入了boss房间，time会重置为0，totaltime则不会；而当你开始了一个新游戏，包括衔尾蛇自动循环的游戏，time和totaltime都会重置为0）'
		},
		{ id: 'armor', name: '玩家当前的护甲值，向下取整' },
		{ id: 'armor.f', name: '玩家当前的护甲值的小数点后第一位' },
		{ id: 'buffs', name: '增益效果' },
		{ id: 'buffs.count', name: '效果数量' },
		{ id: 'buffs.string', name: '效果信息' },
		{ id: 'debuffs', name: '负面效果' },
		{ id: 'debuffs.count', name: '负面效果数量' },
		{ id: 'debuffs.string', name: '负面效果信息' },
		{ id: 'hp', name: '玩家的当前生命值' },
		{ id: 'maxhp', name: '玩家的最大生命值' },
		{ id: 'maxarmor', name: '玩家的最大护甲值' },
		{ id: 'pos', name: '坐标类' },
		{ id: 'pos.x', name: '玩家的x轴坐标' },
		{ id: 'pos.y', name: '玩家的y轴坐标' },
		{ id: 'pos.z', name: '玩家的z轴坐标' },
		{ id: 'ai', name: 'ai类' },
		{ id: 'ai.enabled', name: '如果AI启用，则为True；如果AI关闭，则为False（例如，在过场动画期间）' },
		{ id: 'ai.paused', name: ' 如果AI暂停，例如在等待宝箱掉落时，则为true' },
		{ id: 'ai.idle', name: '如果玩家空闲，等待攻击之类的事情完成，则为True' },
		{ id: 'ai.walking', name: '如果玩家正在移动，则为true' },
		{ id: 'face', name: '玩家当前的面部表情' },
		{ id: 'key', name: ' 自定义输入的状态（详情请看本文的自定义输入部分）' },
		{ id: 'res', name: '资源类（石头、木头、焦油、气、青铜）' },
		{ id: 'res.stone', name: '石头的数量' },
		{ id: 'res.wood', name: '木头的数量' },
		{ id: 'res.tar', name: '焦油的数量' },
		{ id: 'res.ki', name: '气的数量' },
		{ id: 'res.bronze', name: '青铜的数量' },
		{ id: 'player', name: '玩家类' },
		{ id: 'player.direction', name: '指示玩家面对的方向。返回值1表示右侧，返回值-1表示左侧' },
		{ id: 'player.name', name: '玩家名字' },
		{ id: 'totalgp', name: '根据装备星级和附魔加值计算出的你的物品总“装备点数”' },
		{ id: 'rng', name: '返回一个介于0和9999之间的随机整数' },
		{ id: 'rngf', name: '返回介于0和1之间的随机浮点数' },
		{ id: 'input', name: '输入类' },
		{ id: 'input.x', name: '输入设备（鼠标/触摸）在ASCII网格上的X位置。' },
		{ id: 'input.y', name: '输入设备（鼠标/触摸）在ASCII网格上的Y位置。' },
		{ id: 'screen', name: '屏幕类' },
		{ id: 'screen.i', name: '屏幕在游戏中的位置，作为一个索引，当玩家到达右侧并滑过时，屏幕的位置会增加。' },
		{ id: 'screen.x', name: '屏幕在游戏中的位置' },
		{ id: 'screen.w', name: '屏幕的ASCII网格的宽度' },
		{ id: 'screen.h', name: '屏幕的ASCII网格的高度' },
		{ id: 'utc', name: 'UTC时间' },
		{ id: 'utc.year', name: '年（UTC时间）' },
		{ id: 'utc.month', name: '月（UTC时间）' },
		{ id: 'utc.day', name: '天（UTC时间）' },
		{ id: 'utc.hour', name: '小时（UTC时间）' },
		{ id: 'utc.minute', name: '分钟（UTC时间）' },
		{ id: 'utc.second', name: '秒（UTC时间）' },
		{
			id: 'activate',
			name: 'activate (ability) \n * 激活物品技能 (ability)  可以取以下值：potion, P, left, L, right, R'
		},
		{
			id: 'brew',
			name: 'brew (ingredients) \n * 将药瓶重新装满指定的成分组合。仅在一局开始时间为0时执行。成分可以是石头、木头、焦油或青铜，并且应该用分隔符分开。成分名称可以用英语书写，也可以用设置中选择的语言书写。'
		},
		{ id: 'equip', name: 'equip (str) \n  * 装备一个物品。限制为7个条件' },
		{ id: 'equipL', name: 'equipL (str) \n * 在左手装备一个最符合条件的物品' },
		{ id: 'equipR', name: 'equipR (str) \n * 在右手装备一个最符合条件的物品' },
		{ id: 'loadout', name: 'loadout (n) \n * 激活指定编号的装备组合' },
		{ id: 'var', name: '变量' },
		{ id: 'func', name: '方法体' },
		{ id: 'for', name: '循环体' },
		{ id: 'import', name: '加载并执行外部脚本的单个副本' },
		{ id: 'new', name: '新的对象' },
		{ id: 'disable', name: '禁用' },
		{ id: 'enable', name: '启用' },
		{ id: 'disable abilities', name: '禁用药剂和武器技能激活。也会灰显HUD按钮' },
		{ id: 'enable abilities', name: '启用药剂和武器技能激活' },
		{ id: 'disable banner', name: '禁用banner' },
		{ id: 'enable banner', name: '启用banner' },
		{ id: 'disable hud', name: '隐藏和禁用用户界面元素，包括：资源，生命值，能力按钮和暂停按钮' },
		{ id: 'enable hud', name: '显示和启用用户界面元素' },
		{ id: 'disable pause', name: '隐藏“暂停”按钮用户界面。使用[P]快捷方式仍可以暂停' },
		{ id: 'enable pause', name: '恢复“暂停”按钮用户界面' },
		{ id: 'disable player', name: '隐藏玩家。对战斗没有影响，这只是表面上的' },
		{ id: 'enable player', name: '显示玩家' },
		{ id: 'play', name: '播放音效' },
		{ id: 'ambient', name: '返回所有活动环境音频ID（以逗号分割的字符串）' },
		{ id: 'ambient.Add', name: 'ambient.Add(str) 无返回值 \n * 使用给定的声音ID添加一层环境音频，最多4层。如果添加第五层，则删除最旧的层' },
		{ id: 'ambient.Stop', name: 'ambient.Stop() 无返回值 \n * 将清除所有环境层' },
		{ id: 'draw', name: '画布' },
		{ id: 'draw.Bg', name: 'draw.Bg(x, y, color) 无返回值 \n * 设置特定屏幕位置的背景色' },
		{
			id: 'draw.Box',
			name: 'draw.Box(x, y, w, h, color, style) 无返回值 \n * 在指定的位置和大小绘制矩形。矩形的边框由颜色和样式编号定义。负数编号会使矩形的中心透明。'
		},
		{ id: 'draw.Clear', name: 'draw.Clear() 无返回值 \n * 清除整个屏幕' },
		{ id: 'draw.GetSymbol', name: 'draw.GetSymbol(x, y) 返回string \n * 返回屏幕位置（x，y）的信息' },
		{ id: 'int.Parse', name: 'int.Parse(str) 返回int \n * 将string转换为int' },
		{
			id: 'item.CanActivate',
			name: 'item.CanActivate() 返回boolean \n * 如果可以激活物品能力，则返回true。否则返回false。在某些游戏场景中，所有的能力激活都会被禁用，即使它们不是在冷却时间，比如在BOSS打架之前或在动画中。'
		},
		{ id: 'item.GetCooldown', name: 'item.GetCooldown(str) 返回int \n * 返回给定技能的剩余冷却时间（以帧为单位）' },
		{ id: 'item.GetCount', name: 'item.GetCount(str) 返回int \n * 返回库存中某个项目的副本数。如果未找到任何项，则返回0' },
		{ id: 'loc.Leave', name: 'loc.Leave() 无返回值 \n * 退出副本' },
		{ id: 'loc.Pause', name: 'loc.Leave() 无返回值 \n * 暂停副本' },
		{ id: 'math', name: '运算类' },
		{ id: 'math.Abs', name: 'math.Abs(num) 返回number \n * 绝对值' },
		{ id: 'math.Sign', name: 'math.Sign(num) 返回number \n * 如果给定的数字为负数，则返回-1。否则，返回1。' },
		{ id: 'math.Min', name: 'math.Min(num1, num2) 返回number \n * 最小值' },
		{ id: 'math.Max', name: 'math.Max(num1, num2) 返回number \n * 最大值' },
		{ id: 'math.Clamp', name: 'math.Clamp(num, min, max) 返回number \n * 将数字限制在“最小”和“最大”范围内。如果号码已在范围内，则将不作更改地返回。' },
		{ id: 'math.Round', name: 'math.Round(num) 返回number \n * 四舍五入' },
		{ id: 'math.RoundToInt', name: 'math.RoundToInt(num) 返回int \n * 四舍五入取整' },
		{ id: 'math.Floor', name: 'math.Floor(num) 返回number \n * 向下返回number（保留小数位数）' },
		{ id: 'math.FloorToInt', name: 'math.FloorToInt(num) 返回int \n * 向下取整' },
		{ id: 'math.Ceil', name: 'math.Ceil(num) 返回number \n * 向上返回number（保留小数位数）' },
		{ id: 'math.CeilToInt', name: 'math.CeilToInt(num) 返回int \n * 向上取整' },
		{ id: 'math.Lerp', name: 'math.Lerp(a, b, t) 返回number \n * 在时间（百分比）t执行从值a到b的线性插值' },
		{ id: 'math.Log', name: 'math.Log(num, base) 返回number \n * 返回给定基数处的数字对数' },
		{ id: 'math.Pow', name: 'math.Log(num, p) 返回number \n * 返回提升为幂的数字' },
		{ id: 'math.Sqrt', name: 'math.Log(num) 返回number \n * 返回数字的平方根' },
		{ id: 'math.pi', name: 'math.Log(num, base) 返回number \n * 返回π' },
		{ id: 'math.ToDeg', name: 'math.ToDeg(num) 返回number \n * 将弧度数转换为度' },
		{ id: 'math.ToRad', name: 'math.ToRad(num) 返回number \n * 将度数转换为弧度' },
		{ id: 'math.Acos', name: 'math.Acos(num) 返回number \n * 返回数字的弧余弦，以弧度为单位。输入边界为-1到1。如果输入值超出范围，则返回“NaN”' },
		{ id: 'math.Asin', name: 'math.Asin(num) 返回number \n * 返回一个数字的弧正弦，以弧度为单位。输入边界为-1到1。如果输入值超出范围，则返回“NaN”' },
		{ id: 'math.Atan', name: 'math.Atan(num) 返回number \n * 返回数字的反正切值，以弧度为单位' },
		{ id: 'math.Cos', name: 'math.Cos(num) 返回number \n * 返回给定弧度角的余弦' },
		{ id: 'math.Sin', name: 'math.Sin(num) 返回number \n * 返回给定弧度角的正弦值' },
		{ id: 'math.Tan', name: 'math.Tan(num) 返回number \n * 返回给定弧度角的切线' },
		{ id: 'music', name: '音乐类' },
		{ id: 'music.Play', name: 'music.Play(str) 无返回值 \n * 播放具有给定声音ID的音乐。一次只能播放一首音乐' },
		{ id: 'music.Stop', name: 'music.Stop() 无返回值 \n * 停止播放所有音乐' },
		{ id: 'player.ShowScaredFace', name: 'player.ShowScaredFace(num) 返回值 \n * 如果玩家启用了“大头”，他们的面部表情会在一定时间内变为“害怕”' },
		{ id: 'screen.FromWorldX', name: 'screen.FromWorldX(int) 返回int \n * 将X轴上的值从世界空间转换为屏幕空间' },
		{ id: 'screen.FromWorldZ', name: 'screen.FromWorldZ(int) 返回int \n * 将值从世界空间Z轴转换为屏幕空间Y轴' },
		{ id: 'screen.ToWorldX', name: 'screen.ToWorldX(int) 返回int \n * 将X轴上的值从屏幕空间转换为世界空间' },
		{ id: 'screen.ToWorldZ', name: 'screen.ToWorldZ(int) 返回int \n * 将值从屏幕空间Y轴转换为世界空间Z轴' },
		{ id: 'screen.Next', name: 'screen.Next() 无返回值 \n * 向前移动一个屏幕' },
		{ id: 'screen.Previous', name: 'screen.Previous() 无返回值 \n * 向后移动一个屏幕' },
		{ id: 'screen.ResetOffset', name: 'screen.ResetOffset() 无返回值 \n * 重置屏幕位置' },
		{ id: 'storage', name: '本地储存' },
		{ id: 'storage.Delete', name: 'storage.Delete(string) 无返回值 \n * 删除指定键上可能存在的任何值' },
		{ id: 'storage.Get', name: 'storage.Get(string) 返回string \n * 检索存储在指定键处的永久值' },
		{ id: 'storage.Has', name: 'storage.Has(string) 返回boolean \n * 判断值是否存在' },
		{ id: 'storage.Incr', name: 'storage.Incr(string) 返回int \n * 将存储在指定键处的值增加1，然后返回新值' },
		{ id: 'storage.Set', name: 'storage.Set(string) 无返回值 \n * 以指定的键将值保存到永久存储器' },
		{ id: 'string', name: '字符类' }
	]
	for (let index = 0; index < list.length; index++) {
		const item = list[index]
		if (item.id == word) {
			return new vscode.Hover(item.name)
		}
		if (item.id.includes('.')) {
			let arr = item.id.split('.')
			let len = arr[0].length + 1
			if (arr[1] == word) {
				let index = line.text.indexOf(item.id, wordposition.start.character - len)
				if (index > -1) {
					return new vscode.Hover(item.name)
					// let url='https://www.sykblock.love/banner2.png';
					// return new vscode.Hover(new vscode.MarkdownString(`![](${url}|width=240)`))
				}
			}
		}
		if (item.id.includes(' ')) {
			let arr = item.id.split(' ')
			let len = arr[0].length + 1
			if (arr[1] == word) {
				let index = line.text.indexOf(item.id, wordposition.start.character - len)
				if (index > -1) {
					return new vscode.Hover(item.name)
				}
			}
		}
	}
}

module.exports = function (context) {
	// 注册鼠标悬停提示
	context.subscriptions.push(
		vscode.languages.registerHoverProvider('stonescript', {
			provideHover
		})
	)
}
