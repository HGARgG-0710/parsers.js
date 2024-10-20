import type { FixedSkipState, SkipState, SkipType } from "./interfaces.js"
import type { Position } from "../../Position/interfaces.js"
import { skip } from "../utils.js"

export function skipParserChange<OutType = any>(
	this: SkipState<OutType>,
	[toSkip, tempResult]: SkipType<Iterable<OutType>>
) {
	this.result.push(...tempResult)
	skip(this.streams![0], toSkip)
}

export function fixedParserChange(n: Position) {
	return function <OutType = any>(
		this: FixedSkipState<OutType>,
		temp: Iterable<OutType>
	) {
		this.result.push(...temp)
		skip(this.streams![0], n)
	}
}
