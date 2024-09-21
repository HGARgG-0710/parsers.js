import { isIterable } from "../IterableStream/utils.js"
import { isPositionalStream } from "../PositionalStream/utils.js"
import { isInputted } from "../UnderStream/utils.js"
import type {
	Lookahead,
	Predicated,
	Proddable,
	SinglePositionLookahead,
	BasicPredicated,
	PredicateStream
} from "./interfaces.js"

import { object, function as _f, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type
const { and } = _f

export const isProddable = structCheck<Proddable>({ prod: isFunction })
export const isLookahead = structCheck<Lookahead>(["lookAhead"])
export const isPredicated = structCheck<Predicated>({ predicate: isFunction })

export const isSinglePositionLookahead = and(isProddable, isLookahead) as (
	x: any
) => x is SinglePositionLookahead

export const isBasicPredicated = and(isPredicated, isSinglePositionLookahead) as (
	x: any
) => x is BasicPredicated

export const isPredicateStream = and(
	isPositionalStream,
	isBasicPredicated,
	isInputted,
	isIterable
) as (x: any) => x is PredicateStream
