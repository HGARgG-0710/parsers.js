import { parserChoice } from "./parsers.mjs"

export function SourceGenerator(generateMap) {
	const generator = parserChoice(generateMap)
	return function (stream, prevSource) {
		let result = prevSource
		while (!stream.isEnd()) {
			result = result.concat(generator(stream))
			stream.next()
		}
		return result
	}
}
