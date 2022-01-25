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
	const word = document.getText(document.getWordRangeAtPosition(position))
	console.log(document.getWordRangeAtPosition(position))
	let list = [
		{ id: 'loc', name: '玩家正在访问的当前位置' },
		{ id: 'foe', name: '当前被玩家选为目标的敌人' },
		{ id: 'item', name: '装备类（左右手武器，正在酿造的药水）' },
		{ id: 'harvest', name: '下一个可收获的物体，例如大树和巨石' },
		{ id: 'pickup', name: '当前被玩家选为目标的拾取物品' },
		{ id: 'armor', name: '玩家当前的护甲值，向下取整' },
		{ id: 'buffs', name: '增益效果' },
		{ id: 'debuffs', name: '负面效果' },
		{ id: 'hp', name: '玩家的当前生命值' },
		{ id: 'maxhp', name: '玩家的最大生命值' },
		{ id: 'maxarmor', name: '玩家的最大护甲值' },
		{ id: 'pos', name: '坐标类' },
		{ id: 'ai', name: 'ai类' },
		{ id: 'face', name: '玩家当前的面部表情' },
		{ id: 'key', name: ' 自定义输入的状态（详情请看本文的自定义输入部分）' },
		{ id: 'res', name: '资源类（石头、木头、焦油、气）' },
		{ id: 'player', name: '玩家类' },
		{ id: 'totalgp', name: '根据装备星级和附魔加值计算出的你的物品总“装备点数”' },
		{ id: 'rng', name: '返回一个介于0和9999之间的随机整数' },
		{ id: 'rngf', name: '返回介于0和1之间的随机浮点数' },
		{ id: 'input', name: '输入类' },
		{ id: 'screen', name: '屏幕类' },
		{ id: 'time', name: '地区的当前帧号' },
		{
			id: 'totaltime',
			name: '游戏的当前帧号。（例如你进入了boss房间，time会重置为0，totaltime则不会；而当你开始了一个新游戏，包括衔尾蛇自动循环的游戏，time和totaltime都会重置为0）'
		},
		{ id: 'utc', name: 'utc时间' },
		{ id: 'activate', name: '激活物品技能' },
		{
			id: 'brew',
			name: '将药瓶重新装满指定的成分组合。仅在一局开始时间为0时执行。成分可以是石头、木头、焦油或青铜，并且应该用分隔符分开。成分名称可以用英语书写，也可以用设置中选择的语言书写。'
		},
		{ id: 'equip', name: ' 装备一个物品。(str) 限制为7个条件' },
		{ id: 'equipL', name: '在左手装备一个最符合条件的物品' },
		{ id: 'equipR', name: '在右手装备一个最符合条件的物品' },
		{ id: 'loadout', name: '激活指定编号的装备组合' },
		{ id: 'var', name: '变量' },
		{ id: 'func', name: '方法体' },
		{ id: 'for', name: '循环体' },
		{ id: 'import', name: '加载并执行外部脚本的单个副本' },
		{ id: 'new', name: '新的对象' },
		{ id: 'disable', name: '禁用' },
		{ id: 'enable', name: '启用' },
		{ id: 'play', name: '播放音效' },
		{ id: 'ambient', name: '返回所有活动环境音频ID（以逗号分割的字符串）' },
		{ id: 'draw', name: '画布' },
		{ id: 'math', name: '运算类' },
		{ id: 'music', name: '音乐类' },
		{ id: 'storage', name: '本地储存' },
		{ id: 'string', name: '字符类' }
	]
	let obj = list.find(x => x.id == word)
	if (obj) {
		return new vscode.Hover(obj.name)
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
