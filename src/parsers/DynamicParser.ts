import type { BasicStream } from "../types.js"
import type { Pushable } from "./StreamParser.js"
import type { ParserMap} from "./TableParser.js"

export function DynamicParser<KeyType = any, OutType = any>(
	input: BasicStream,
	init: Pushable,
	parserMap: ParserMap<KeyType, OutType>
) {
	const result = init
	while (!input.isEnd()) result.push(parserMap.index(input.curr())(input, parserMap))
	return result
}
