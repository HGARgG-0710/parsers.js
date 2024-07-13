import { isFunction } from "../misc.js"
import type { BasicStream } from "../types/Stream.js"
import type { ParserMap } from "./ParserMap.js"

export type Falsy = null | undefined | false | "" | 0 | typeof NaN

export function StreamTokenizer<KeyType = any, OutType = any>(
	tokenMap: ParserMap<KeyType, OutType>
) {
	return function (input: BasicStream): BasicStream<OutType, Falsy> {
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
