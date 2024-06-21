import { parserChoice } from "../misc.js"
import { TableParser, type ParserFunction, type ParserMap } from "../parsers.js"
import type { PositionalStream } from "../types.js"

export function StreamLocator<KeyType = any>(
	locatorMap: ParserMap<KeyType, ParserFunction<boolean>> | TableParser<boolean>
) {
	const locator: TableParser<boolean> = parserChoice(locatorMap)
	return function (input: PositionalStream): [boolean, number] {
		let found = false
		while (!input.isEnd()) {
			if ((found = locator(input))) break
			input.next()
		}
		return [found, input.pos]
	}
}
