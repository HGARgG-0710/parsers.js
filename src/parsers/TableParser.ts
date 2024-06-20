import type { IndexMap } from "../types/IndexMap.js"
import type { Stream } from "../types/Stream.js"

export type ParserFunction<OutType = any> = (
	input?: Stream,
	parser?: ParserFunction
) => OutType

export function TableParser<KeyType = any, OutType = any>(
	parserMap: IndexMap<KeyType, ParserFunction<OutType>>,
	next?: ParserFunction<OutType>
) {
	const parser = (input: Stream) => parserMap.index(input.curr())(input, next || parser)
	return parser
}
