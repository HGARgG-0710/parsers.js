import { TableParser, type ParserFunction } from "../parsers.js"
import type { IndexMap, PositionalStream } from "../types.js"

export function StreamLocator<KeyType = any>(
	locatorMap: IndexMap<KeyType, ParserFunction<boolean>>
) {
	const locator = TableParser(locatorMap)
	return function (input: PositionalStream): [boolean, number] {
		let found = false
		while (!input.isEnd()) {
			if ((found = locator(input))) break
			input.next()
		}
		return [found, input.pos]
	}
}
