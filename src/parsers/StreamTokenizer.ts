import { isFunction } from "../misc.js"
import type { BasicStream } from "src/types/Stream/BasicStream.js"
import type { ParserMap } from "./ParserMap.js"

export function StreamTokenizer<KeyType = any, OutType = any>(
	tokenMap: ParserMap<KeyType, OutType>
) {
	return function (input: BasicStream): BasicStream<OutType> {
		const STARTVALUE = {}
		let current: OutType | typeof STARTVALUE = STARTVALUE

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
