import { skip } from "../utils.js"
import type { FixedSkipState, SkipState, SkipType } from "./interfaces.js"
import type { Position } from "src/Stream/PositionalStream/Position/interfaces.js"
import type { ReversibleStream } from "src/Stream/ReversibleStream/interfaces.js"

export function skipParserChange<KeyType = any, OutType = any>(
	this: SkipState<KeyType, OutType>,
	[toSkip, tempResult]: SkipType<Iterable<OutType>>
) {
	this.result.push(...tempResult)
	skip((this.streams as ReversibleStream[])[0], toSkip)
}

export function fixedParserChange(n: Position) {
	return function <KeyType = any, OutType = any>(
		this: FixedSkipState<KeyType, OutType>,
		temp: Iterable<OutType>
	) {
		this.result.push(...temp)
		skip((this.streams as ReversibleStream[])[0], n)
	}
}
