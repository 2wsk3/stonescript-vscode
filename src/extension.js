const vscode = require('vscode')

/**
 * 插件被激活时触发，所有代码总入口
 * @param {*} context 插件上下文
 */
exports.activate = function (context) {
	console.log('恭喜，您的扩展“StoneScript”已被激活！')
	console.log(vscode)
	require('./completion')(context) // 自动补全
	require('./hover')(context) // 悬停提示
}

/**
 * 插件被释放时触发
 */
exports.deactivate = function () {
	console.log('您的扩展“StoneScript”已被释放！')
}
