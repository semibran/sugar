var delimiters = /\ |\(|\)|\:|\+|\-|\*|\/|'|,|\./

const keywords   = ['if', 'else', 'def', 'return', 'import', 'export', 'for', 'in']
const whitespace = [' ']
const operators  = '+-*=<>.:'.split('')
const others     = '()[]{},'.split('')
const quotes     = `'"`.split('')

const escapes = '+*/()[]{}.'.split('')

const tokens = [whitespace, operators, others, quotes]
const regex =
	new RegExp(
		tokens
			.map(
				list => list
					.map(
						token => escapes.indexOf(token) !== -1 ? '\\' + token : token
					)
					.join('|')
			)
			.join('|')
	)

module.exports = function parse(code) {
	var lines = code
		.split('\n')
		.map((line, index) => {
			var raw = line
			var text = line
			var level = 0
			var tokens = []
			if (line) {
				var split = line.split('\t')
				text = split.pop()
				level = split.length
				var definition = null
				for (var index, current = text; current && (index = current.search(regex)) !== -1;) {
					var delimiter = current[index]
					var token = current.slice(0, index)
					if (quotes.indexOf(delimiter) !== -1) {
						var next = current.indexOf(delimiter, index + 1)
						token = current.slice(index, next + 1)
						addToken(token)
						current = current.slice(next + 1)
					} else {
						if (token)
							addToken(token)
						addToken(delimiter)
						current = current.slice(index + 1)
					}
				}
				if (current)
					addToken(current)
			}
			return { raw, text, level, tokens }
			function addToken(token) {
				var last
				if (tokens.length)
					last = tokens[tokens.length - 1].text
				var type = null
				if (/'[^']*'/.test(token))
					type = 'string'
				else if (keywords.indexOf(token) !== -1)
					type = 'keyword'
				else if (operators.indexOf(token) !== -1)
					type = 'operator'
				else if (whitespace.indexOf(token) !== -1)
					type = 'whitespace'
				else if (token && !isNaN(token))
					type = 'number'
				if (!definition) {
					if (token === 'def' || token === 'for')
						definition = { name: null, value: null, type: null, assigning: false }
				} else {
					if (type !== 'whitespace') {
						if (!definition.name) {
							definition.name = token
							definition.type = type = 'variable'
						}
					}
				}
				token = { type, text: token }
				tokens.push(token)
			}
		})
	return lines
}
