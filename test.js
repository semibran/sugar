const fs = require('fs')
const parse = require('./parser')
const chalk = require('chalk')

const colors = {
	keyword: 'blue',
	variable: 'yellow',
	operator: 'cyan',
	number: 'magenta',
	string: 'green'
}

var code = fs.readFileSync('./modules/Math', 'utf-8')
var data = parse(code)

for (var line of data) {
	var text = ''
	for (var i = line.level; i--;)
		text += '  '
	for (var token of line.tokens) {
		var color = colors[token.type] || null
		if (color)
			text += chalk[color](token.text)
		else
			text += token.text
	}
	console.log(text)
}
