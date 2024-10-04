import { isIterable } from "../StreamClass/Iterable/utils.js"
import { isPosition } from "../PositionalStream/Position/utils.js"
import { isPositionalStream } from "../PositionalStream/utils.js"
import { isSinglePositionLookahead } from "../PredicateStream/utils.js"
import { isInputted } from "../UnderStream/utils.js"
import type { LimitedStream, BasicLimited, Limitable } from "./interfaces.js"

import { object, function as _f, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type
const { and } = _f

export const isLimitable = structCheck<Limitable>({ limit: isFunction })
export const isBasicLimited = structCheck<BasicLimited>({
	to: isPosition,
	from: isPosition
})

export const isLimitedStream = and(
	isBasicLimited,
	isPositionalStream,
	isSinglePositionLookahead,
	isInputted,
	isIterable
) as (x: any) => x is LimitedStream
