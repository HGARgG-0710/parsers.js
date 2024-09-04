import { skip } from "_src/parsers.js"
import type { FixedSkipState, SkipState, SkipType } from "./interfaces.js"
import type { Position } from "_src/types.js"

export function skipParserChange<KeyType = any, OutType = any>(
	this: SkipState<KeyType, OutType>,
	[toSkip, tempResult]: SkipType<Iterable<OutType>>
) {
	this.result.push(...tempResult)
	skip(toSkip)(this.streams[0])
}

export function fixedParserChange(n: Position) {
	const fixedSkip = skip(n)
	return function <KeyType = any, OutType = any>(
		this: FixedSkipState<KeyType, OutType>,
		temp: Iterable<OutType>
	) {
		this.result.push(...temp)
		fixedSkip(this.streams[0])
	}
}
