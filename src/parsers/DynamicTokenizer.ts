import { isFunction } from "../misc.js"
import type { BasicStream } from "../types/Stream.js"
import type { ParserMap } from "./TableParser.js"

import type { Falsy } from "./StreamTokenizer.js"

export function DynamicTokenizer<KeyType = any, OutType = any>(
	input: BasicStream,
	tokenMap: ParserMap<KeyType, OutType>
): BasicStream<OutType, Falsy> {
	const STARTVALUE = {}
	let current: OutType | {} = STARTVALUE

	const RESULT = {
		next: function () {
			const prev = current
			current = ((x) => (isFunction(x) ? x.call(this, input, tokenMap) : x))(
				tokenMap.index(input.curr())
			)
			input.next()
			return prev as OutType
		},
		curr: function () {
			if (current === STARTVALUE) this.next()
			return current as OutType
		},
		isEnd: function () {
			return !this.curr()
		}
	}
	RESULT.curr()
	return RESULT
}
