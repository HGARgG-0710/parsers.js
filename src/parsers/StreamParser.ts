import type { ParserMap, TableParser } from "./TableParser.js"
import { parserChoice } from "../misc.js"
import type { BasicStream } from "../types/Stream.js"

export function StreamParser<KeyType = any, OutType = any>(
	parserMap: TableParser<OutType[]> | ParserMap<KeyType, OutType[]>
) {
	const parser: TableParser<OutType[]> = parserChoice<KeyType, OutType[]>(parserMap)
	return function (input: BasicStream, initial: Pushable = []) {
		const final = initial
		while (!input.isEnd()) {
			final.push(...parser(input))
			input.next()
		}
		return final
	}
}
