import { parserChoice } from "../misc.js"
import type { TableParser, ParserMap } from "../parsers.js"
import type { PositionalStream } from "../types.js"

export function StreamLocator<KeyType = any>(
	locatorMap: ParserMap<KeyType, boolean> | TableParser<boolean>
) {
	const locator: TableParser<boolean> = parserChoice<KeyType, boolean>(locatorMap)
	return function (input: PositionalStream): [boolean, number] {
		let found = false
		while (!input.isEnd()) {
			if ((found = locator(input))) break
			input.next()
		}
		return [found, input.pos]
	}
}
