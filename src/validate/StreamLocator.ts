import type { ParserMap } from "../parsers.js"
import type { Position, PositionalStream } from "../types.js"

export function StreamLocator<KeyType = any>(locator: ParserMap<KeyType, boolean>) {
	return function (input: PositionalStream): [boolean, number | Position] {
		let found = false
		while (!input.isEnd()) {
			if ((found = locator(input))) break
			input.next()
		}
		return [found, input.pos]
	}
}
