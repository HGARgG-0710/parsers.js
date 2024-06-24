import { parserChoice } from "../misc.js"
import type { Stream } from "../types.js"
import type { Pushable } from "./StreamParser.js"
import type { ParserMap, TableParser } from "./TableParser.js"

// * note: doesn't do iteration - leaves it to the user...
export function BasicParser<KeyType = any, OutType = any>(
	parserMap: TableParser<OutType[]> | ParserMap<KeyType, OutType[]>
) {
	const parser: TableParser<OutType[]> = parserChoice<KeyType, OutType[]>(parserMap)
	return function (input: Stream, init: Pushable) {
		const result = init
		while (!input.isEnd()) result.push(...parser(input))
		return result
	}
}
