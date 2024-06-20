export function TableParser(parserMap, next) {
	const parser = (input) => parserMap.index(input.curr())(input, next || parser)
	return parser
}