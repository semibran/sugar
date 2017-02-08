const fs = require('fs')
const split = require('./lexer')
const chalk = require('chalk')

const styles = {
	keyword: chalk.magenta,
	variable: chalk.yellow,

	constant: chalk.red,
	module: chalk.red,

	number: chalk.red,
	string: chalk.green,

	operator: chalk.cyan,
	punctuation: chalk.blue
}

var code = fs.readFileSync('./modules/test', 'utf-8')
var data = split(code)

// console.log(JSON.stringify(data, null, 2))

for (var line of data) {
	var result = ''
	for (var token of line.tokens) {
		var { text, type } = token
		if (type === 'operator' || type === 'keyword' && result || text === '}')
			result += ' '
		result += styles[type](text)
		if (type === 'operator' || type === 'keyword' || text === ',' || text === '{')
			result += ' '
	}
	for (var i = line.level; i--;)
		result = '  ' + result
	console.log(result)
}
