import type { ParserMap, TableParser } from "../parsers.js"
import type { BasicStream } from "../types.js"

export function StreamValidator<KeyType = any>(
	validityMap: ParserMap<KeyType>
): TableParser {
	return function (input: BasicStream<KeyType>) {
		while (!input.isEnd()) {
			const check = validityMap.index(input.curr())
			if (!check || !check(input)) return false
			input.next()
		}
		return true
	}
}
