const vscode = require('vscode')
const util = require('./util')

/**
 * 自动提示实现
 * @param {*} document
 * @param {*} position
 * @param {*} token
 * @param {*} context
 */
function provideCompletionItems(document, position, token, context) {
	const line = document.lineAt(position)

	// 只截取到光标位置为止，防止一些特殊情况
	const lineText = line.text.substring(0, position.character)
	let str = lineText.substring(lineText.length - 1, lineText.length)

	// 匹配
	let dependencies = []
	if (str != '.' && lineText.indexOf('//') == -1) {
		dependencies = [
			{ name: 'loc', type: vscode.CompletionItemKind.Field },
			{ name: 'foe', type: vscode.CompletionItemKind.Field },
			{ name: 'item', type: vscode.CompletionItemKind.Field },
			{ name: 'harvest', type: vscode.CompletionItemKind.Field },
			{ name: 'pickup', type: vscode.CompletionItemKind.Field },
			{ name: 'armor', type: vscode.CompletionItemKind.Field },
			{ name: 'buffs', type: vscode.CompletionItemKind.Field },
			{ name: 'debuffs', type: vscode.CompletionItemKind.Field },
			{ name: 'hp', type: vscode.CompletionItemKind.Field },
			{ name: 'maxhp', type: vscode.CompletionItemKind.Field },
			{ name: 'maxarmor', type: vscode.CompletionItemKind.Field },
			{ name: 'pos', type: vscode.CompletionItemKind.Field },
			{ name: 'ai', type: vscode.CompletionItemKind.Field },
			{ name: 'face', type: vscode.CompletionItemKind.Field },
			{ name: 'key', type: vscode.CompletionItemKind.Field },
			{ name: 'res', type: vscode.CompletionItemKind.Field },
			{ name: 'player', type: vscode.CompletionItemKind.Field },
			{ name: 'totalgp', type: vscode.CompletionItemKind.Field },
			{ name: 'rng', type: vscode.CompletionItemKind.Field },
			{ name: 'rngf', type: vscode.CompletionItemKind.Field },
			{ name: 'input', type: vscode.CompletionItemKind.Field },
			{ name: 'screen', type: vscode.CompletionItemKind.Field },
			{ name: 'time', type: vscode.CompletionItemKind.Field },
			{ name: 'totaltime', type: vscode.CompletionItemKind.Field },
			{ name: 'utc', type: vscode.CompletionItemKind.Field },
			{ name: 'activate', type: vscode.CompletionItemKind.Keyword },
			{ name: 'brew', type: vscode.CompletionItemKind.Keyword },
			{ name: 'equip', type: vscode.CompletionItemKind.Keyword },
			{ name: 'equipL', type: vscode.CompletionItemKind.Keyword },
			{ name: 'equipR', type: vscode.CompletionItemKind.Keyword },
			{ name: 'loadout', type: vscode.CompletionItemKind.Keyword },
			{ name: 'var', type: vscode.CompletionItemKind.Keyword },
			{ name: 'func', type: vscode.CompletionItemKind.Keyword },
			{ name: 'for', type: vscode.CompletionItemKind.Keyword },
			{ name: 'import', type: vscode.CompletionItemKind.Keyword },
			{ name: 'new', type: vscode.CompletionItemKind.Keyword },
			{ name: 'disable', type: vscode.CompletionItemKind.Keyword },
			{ name: 'enable', type: vscode.CompletionItemKind.Keyword },
			{ name: 'play', type: vscode.CompletionItemKind.Keyword },
			{ name: 'ambient', type: vscode.CompletionItemKind.Function },
			{ name: 'draw', type: vscode.CompletionItemKind.Class },
			{ name: 'int', type: vscode.CompletionItemKind.Keyword },
			{ name: 'math', type: vscode.CompletionItemKind.Class },
			{ name: 'music', type: vscode.CompletionItemKind.Class },
			{ name: 'storage', type: vscode.CompletionItemKind.Class },
			{ name: 'string', type: vscode.CompletionItemKind.Keyword },
			{ name: 'te', type: vscode.CompletionItemKind.Keyword },
			{ name: 'ui', type: vscode.CompletionItemKind.Keyword },
			{ name: 'button', type: vscode.CompletionItemKind.Keyword },
			{ name: 'Type()', type: vscode.CompletionItemKind.Function }
		]
	}
	if (/(loc\.$|loc\.\w+$)/g.test(lineText)) {
		dependencies = [
			'id',
			'name',
			'stars',
			'begin',
			'loop',
			'bestTime',
			'averageTime',
			{ name: 'Leave()', type: vscode.CompletionItemKind.Function },
			{ name: 'Pause()', type: vscode.CompletionItemKind.Function }
		]
	}

	if (/(foe\.$|foe\.\w+$)/g.test(lineText)) {
		dependencies = ['name', 'distance', 'count', 'hp', 'maxhp', 'armor', 'maxarmor', 'buffs', 'debuffs', 'state', 'time', 'level']
	}
	if (/(item\.$|item\.\w+$)/g.test(lineText)) {
		dependencies = [
			'left',
			'right',
			'potion',
			{ name: 'CanActivate(str)', type: vscode.CompletionItemKind.Function },
			{ name: 'GetCooldown(str)', type: vscode.CompletionItemKind.Function },
			{ name: 'GetCount(str)', type: vscode.CompletionItemKind.Function }
		]
	}
	if (/(harvest\.$|harvest\.\w+$)/g.test(lineText)) {
		dependencies = ['distance']
	}
	if (/(pickup\.$|pickup\.\w+$)/g.test(lineText)) {
		dependencies = ['distance']
	}
	if (/(armor\.$|armor\.\w+$)/g.test(lineText)) {
		dependencies = ['f']
	}
	if (/(buffs\.$|buffs\.\w+$)/g.test(lineText)) {
		dependencies = ['count', 'string']
	}
	if (/(debuffs\.$|debuffs\.\w+$)/g.test(lineText)) {
		dependencies = ['count', 'string']
	}
	if (/(pos\.$|pos\.\w+$)/g.test(lineText)) {
		dependencies = ['x', 'y', 'z']
	}
	if (/(ai\.$|ai\.\w+$)/g.test(lineText)) {
		dependencies = ['enabled', 'paused', 'idle', 'walking']
	}
	if (/(res\.$|res\.\w+$)/g.test(lineText)) {
		dependencies = ['stone', 'wood', 'tar', 'ki', 'bronze']
	}
	if (/(player\.$|player\.\w+$)/g.test(lineText)) {
		dependencies = ['direction', 'name', { name: 'ShowScaredFace(num)', type: vscode.CompletionItemKind.Function }]
	}
	if (/(input\.$|input\.\w+$)/g.test(lineText)) {
		dependencies = ['x', 'y']
	}
	if (/(screen\.$|screen\.\w+$)/g.test(lineText)) {
		dependencies = [
			'i',
			'x',
			'w',
			'h',
			{ name: 'FromWorldX(int)', type: vscode.CompletionItemKind.Function },
			{ name: 'FromWorldZ(int)', type: vscode.CompletionItemKind.Function },
			{ name: 'Next()', type: vscode.CompletionItemKind.Function },
			{ name: 'Previous()', type: vscode.CompletionItemKind.Function }
		]
	}
	if (/(time\.$|time\.\w+$)/g.test(lineText)) {
		dependencies = [
			'ms',
			'year',
			'month',
			'day',
			'hour',
			'minute',
			'second',
			{ name: 'FormatCasual()', type: vscode.CompletionItemKind.Function },
			{ name: 'FormatDigital()', type: vscode.CompletionItemKind.Function }
		]
	}
	if (/(utc\.$|utc\.\w+$)/g.test(lineText)) {
		dependencies = ['year', 'month', 'day', 'hour', 'minute', 'second']
	}
	if (/disable[ ]+$/g.test(lineText)) {
		dependencies = ['abilities', 'banner', 'hud', 'loadout', 'pause', 'player']
	}
	if (/enable[ ]+$/g.test(lineText)) {
		dependencies = ['abilities', 'banner', 'hud', 'loadout', 'pause', 'player']
	}
	if (/(math\.$|math\.\w+$)/g.test(lineText)) {
		dependencies = [
			{ name: 'Abs(num)', type: vscode.CompletionItemKind.Function },
			{ name: 'Sign(num)', type: vscode.CompletionItemKind.Function },
			{ name: 'Min((num1, num2)', type: vscode.CompletionItemKind.Function },
			{ name: 'Max((num1, num2)', type: vscode.CompletionItemKind.Function },
			{ name: 'Clamp(num, min, max)', type: vscode.CompletionItemKind.Function },
			{ name: 'Round(num)', type: vscode.CompletionItemKind.Function },
			{ name: 'RoundToInt(num)', type: vscode.CompletionItemKind.Function },
			{ name: 'Floor(num)', type: vscode.CompletionItemKind.Function },
			{ name: 'FloorToInt(num)', type: vscode.CompletionItemKind.Function },
			{ name: 'Ceil(num)', type: vscode.CompletionItemKind.Function },
			{ name: 'CeilToInt(num)', type: vscode.CompletionItemKind.Function },
			{ name: 'Lerp(a, b, t)', type: vscode.CompletionItemKind.Function },
			{ name: 'Log(num, base)', type: vscode.CompletionItemKind.Function },
			{ name: 'Pow(num, p)', type: vscode.CompletionItemKind.Function },
			'pi',
			{ name: 'ToDeg(num)', type: vscode.CompletionItemKind.Function },
			{ name: 'ToRad(num)', type: vscode.CompletionItemKind.Function },
			{ name: 'Acos(num)', type: vscode.CompletionItemKind.Function },
			{ name: 'Asin(num)', type: vscode.CompletionItemKind.Function },
			{ name: 'Atan(num)', type: vscode.CompletionItemKind.Function },
			{ name: 'Cos(num)', type: vscode.CompletionItemKind.Function },
			{ name: 'Sin(num)', type: vscode.CompletionItemKind.Function },
			{ name: 'Tan(num)', type: vscode.CompletionItemKind.Function }
		]
	}
	if (/(music\.$|music\.\w+$)/g.test(lineText)) {
		dependencies = [
			{ name: 'Play(str)', type: vscode.CompletionItemKind.Function },
			{ name: 'Stop()', type: vscode.CompletionItemKind.Function }
		]
	}
	if (/(storage\.$|storage\.\w+$)/g.test(lineText)) {
		dependencies = [
			{ name: 'Delete(string)', type: vscode.CompletionItemKind.Function },
			{ name: 'Get(string)', type: vscode.CompletionItemKind.Function },
			{ name: 'Has(string)', type: vscode.CompletionItemKind.Function },
			{ name: 'Incr(string)', type: vscode.CompletionItemKind.Function },
			{ name: 'Set(string)', type: vscode.CompletionItemKind.Function }
		]
	}

	if (/(string\.$|string\.\w+$)/g.test(lineText)) {
		dependencies = [
			{ name: 'Break(string, integer)', type: vscode.CompletionItemKind.Function },
			{ name: 'Capitalize(str)', type: vscode.CompletionItemKind.Function },
			{ name: 'Equals(str1, str2)', type: vscode.CompletionItemKind.Function },
			{ name: 'Format(str1, ...)', type: vscode.CompletionItemKind.Function },
			{ name: 'IndexOf(str, criteria)', type: vscode.CompletionItemKind.Function },
			{ name: 'Join()', type: vscode.CompletionItemKind.Function },
			{ name: 'Size(str)', type: vscode.CompletionItemKind.Function },
			{ name: 'Split()', type: vscode.CompletionItemKind.Function },
			{ name: 'Sub(str, startAt)', type: vscode.CompletionItemKind.Function },
			{ name: 'ToLower(str)', type: vscode.CompletionItemKind.Function },
			{ name: 'ToUpper(str)', type: vscode.CompletionItemKind.Function }
		]
	}

	if (/(te\.$|te\.\w+$)/g.test(lineText)) {
		dependencies = [
			'language',
			{ name: 'xt(str)', type: vscode.CompletionItemKind.Function },
			{ name: 'GetTID(str)', type: vscode.CompletionItemKind.Function },
			{ name: 'ToEnglish(str)', type: vscode.CompletionItemKind.Function }
		]
	}
	if (/(ui\.$|ui\.\w+$)/g.test(lineText)) {
		dependencies = [
			{ name: 'Clear()', type: vscode.CompletionItemKind.Function },
			{ name: 'AddButton()', type: vscode.CompletionItemKind.Function },
			{ name: 'ShowBanner()', type: vscode.CompletionItemKind.Function },
			{ name: 'ShowBanner()', type: vscode.CompletionItemKind.Function }
		]
	}
	if (/(button\.$|button\.\w+$)/g.test(lineText)) {
		dependencies = [
			'x',
			'y',
			'w',
			'h',
			'text',
			'tcolor',
			'bcolor',
			'sound',
			{ name: 'SetPressed(f)', type: vscode.CompletionItemKind.Function },
			{ name: 'AddButton()', type: vscode.CompletionItemKind.Function }
		]
	}

	return dependencies.map(dep => {
		// vscode.CompletionItemKind 表示提示的类型
		if (typeof dep == 'object') {
			return new vscode.CompletionItem(dep.name, dep.type)
		} else {
			return new vscode.CompletionItem(dep, vscode.CompletionItemKind.Field)
		}
	})
}

/**
 * 光标选中当前自动补全item时触发动作，一般情况下无需处理
 * @param {*} item
 * @param {*} token
 */
function resolveCompletionItem(item, token) {
	return null
}

module.exports = function (context) {
	// 注册代码建议提示，只有当按下“.”时才触发
	context.subscriptions.push(
		vscode.languages.registerCompletionItemProvider(
			'stonescript',
			{
				provideCompletionItems,
				resolveCompletionItem
			},
			'.'
		)
	)
}
