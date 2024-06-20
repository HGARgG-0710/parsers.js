export function StreamParser(parserMap) {
	const parser = parserChoice(parserMap)
	return function (input) {
		const final = []
		while (!input.isEnd()) {
			final.push(...parser(input))
			input.next()
		}
		return final
	}
}