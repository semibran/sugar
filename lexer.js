const keywords = ['def', 'return', 'if', 'else', 'for', 'in', 'pass', 'break', 'export']
const rules = {
	keyword: value => {
		var token = value
		var index = value.indexOf(' ')
		if (index !== -1)
			token = value.slice(0, index)
		if (keywords.indexOf(token) !== -1)
			return token
	},
	module: /^[A-Z]\w*/,
	constant: /^[A-Z_]*/,
	variable: /^[A-Za-z_]\w*/,
	operator: /^[+\-*/%=]/,
	punctuation: /^[()\[\]{},.:]/,
	string: /^'[^']*'/,
	number: /\d+/
}

module.exports = function split(code) {
	var lines = code
		.split('\n')
		.map(splitLine)
	return lines
}

function splitLine(line) {

	var split = line.split('\t')
	line = split.pop()
	var level = split.length

	var tokens = []

	if (line) {
		var text = line
		while (text.length) {
			var token
			for (var type in rules) {
				var rule = rules[type]
				if (rule instanceof RegExp) {
					var match = text.trim().match(rule)
					if (match)
						token = match[0]
				} else {
					token = rule(text.trim())
				}
				if (token)
					break
			}
			if (!token)
				throw new Error(`Unrecognized token: '${text}'`)
			tokens.push({	text: token, type })
			text = text.slice(text.indexOf(token) + token.length)
		}
	}

	return { tokens, level }

}
