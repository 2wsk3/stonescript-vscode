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
			{ name: 'type', type: vscode.CompletionItemKind.Keyword }
		]
	}
	if (/(^\??loc\.$|^\??loc\.\w+$)/g.test(lineText)) {
		dependencies = ['id', 'name', 'stars', 'begin', 'loop', 'bestTime', 'averageTime']
	}
	if (/(^\??loc\.$|^\??loc\.\w+$)/g.test(lineText)) {
		dependencies = ['id', 'name', 'stars', 'begin', 'loop', 'bestTime', 'averageTime']
	}
	if (/(^\??foe\.$|^\??foe\.\w+$)/g.test(lineText)) {
		dependencies = ['name', 'distance', 'count', 'hp', 'maxhp', 'armor', 'maxarmor', 'buffs', 'debuffs', 'state', 'time', 'level']
	}
	if (/(^\??item\.$|^\??item\.\w+$)/g.test(lineText)) {
		dependencies = ['left', 'right', 'potion']
	}
	if (/(^\??harvest\.$|^\??harvest\.\w+$)/g.test(lineText)) {
		dependencies = ['distance']
	}
	if (/(^\??pickup\.$|^\??pickup\.\w+$)/g.test(lineText)) {
		dependencies = ['distance']
	}
	if (/(^\??armor\.$|^\??armor\.\w+$)/g.test(lineText)) {
		dependencies = ['f']
	}
	if (/(buffs\.$|buffs\.\w+$)/g.test(lineText)) {
		dependencies = ['count', 'string']
	}
	if (/(debuffs\.$|debuffs\.\w+$)/g.test(lineText)) {
		dependencies = ['count', 'string']
	}
	if (/(^\??pos\.$|^\??pos\.\w+$)/g.test(lineText)) {
		dependencies = ['x', 'y', 'z']
	}
	if (/(^\??ai\.$|^\??ai\.\w+$)/g.test(lineText)) {
		dependencies = ['enabled', 'paused', 'idle', 'walking']
	}
	if (/(^\??res\.$|^\??res\.\w+$)/g.test(lineText)) {
		dependencies = ['stone', 'wood', 'tar', 'ki', 'bronze']
	}
	if (/(^\??player\.$|^\??player\.\w+$)/g.test(lineText)) {
		dependencies = ['direction', 'name']
	}
	if (/(^\??input\.$|^\??input\.\w+$)/g.test(lineText)) {
		dependencies = ['x', 'y']
	}
	if (/(^\??screen\.$|^\??screen\.\w+$)/g.test(lineText)) {
		dependencies = ['i', 'x', 'w', 'h']
	}
	if (/(^\??time\.$|^\??time\.\w+$)/g.test(lineText)) {
		dependencies = ['ms', 'year', 'month', 'day', 'hour', 'minute', 'second']
	}
	if (/(^\??utc\.$|^\??utc\.\w+$)/g.test(lineText)) {
		dependencies = ['year', 'month', 'day', 'hour', 'minute', 'second']
	}
	if (/(^\??utc\.$|^\??utc\.\w+$)/g.test(lineText)) {
		dependencies = ['year', 'month', 'day', 'hour', 'minute', 'second']
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
