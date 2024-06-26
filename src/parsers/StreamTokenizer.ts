import { isFunction } from "../misc.js"
import type { Stream } from "../types/Stream.js"
import type { ParserMap } from "./TableParser.js"

export type Falsy = null | undefined | false | "" | 0 | typeof NaN

export function StreamTokenizer<KeyType = any, OutType = any>(
	tokenMap: ParserMap<KeyType, OutType>
) {
	return function (input: Stream): Stream<OutType, Falsy> {
		const STARTVALUE = {}
		let current: OutType | {} = STARTVALUE

		const RESULT = {
			next: function () {
				const prev = current
				current = ((x) => (isFunction(x) ? x.call(this, input) : x))(
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
}
