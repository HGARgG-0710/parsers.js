import type { Started, ReversibleStream, BasicReversibleStream } from "./interfaces.js"

import type { Prevable } from "./interfaces.js"
import { isIterableStream } from "../StreamClass/Iterable/utils.js"

import { object, typeof as type, function as _f } from "@hgargg-0710/one"
const { structCheck } = object
const { isBoolean, isFunction } = type
const { and } = _f

export const isBasicStarted = structCheck<Started>(["isStart"])
export const isStarted = structCheck<Started>({ isStart: isBoolean })
export const isPrevable = structCheck<Prevable>({ prev: isFunction })

export const isReversibleStream = and(isStarted, isPrevable, isIterableStream) as <
	Type = any
>(
	x: any
) => x is ReversibleStream<Type>

export const isBasicReversibleStream = and(
	isBasicStarted,
	isPrevable,
	isIterableStream
) as <Type = any>(x: any) => x is BasicReversibleStream<Type>
