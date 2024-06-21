import type { ParserMap } from "../parsers.js"
import { parserChoice } from "../misc.js"
import type { Stream } from "../types/Stream.js"
import type { Concattable } from "../types/Source.js"

export function SourceGenerator<KeyType = any, OutType = any>(
	generateMap: Function | ParserMap<KeyType, OutType>
) {
	const generator = parserChoice<OutType>(generateMap)
	return function (stream: Stream, prevSource: Concattable<OutType>) {
		let result = prevSource
		while (!stream.isEnd()) {
			result = result.concat(generator(stream))
			stream.next()
		}
		return result
	}
}
