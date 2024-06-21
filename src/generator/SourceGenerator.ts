import type { ParserFunction } from "../parsers.js"
import type { IndexMap } from "../types/IndexMap.js"
import { parserChoice } from "../misc.js"
import type { Stream } from "../types/Stream.js"
import type { Source } from "../types/Source.js"

export function SourceGenerator<KeyType = any, OutType = any>(
	generateMap: Function | IndexMap<KeyType, ParserFunction<OutType>>
) {
	const generator = parserChoice(generateMap)
	return function <Type = any>(stream: Stream, prevSource: Source<Type>) {
		let result = prevSource
		while (!stream.isEnd()) {
			result = result.concat(generator(stream))
			stream.next()
		}
		return result
	}
}
