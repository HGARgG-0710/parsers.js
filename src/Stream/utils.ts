import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type

import type {
	IsEndCurrable,
	IsStartCurrable,
	Prevable,
	Nextable,
	Inputted
} from "./interfaces.js"

export const isInputted = structCheck<Inputted>(["input"])
export const isBaseNextable = structCheck<Nextable>({ baseNext: isFunction })
export const isBasePrevable = structCheck<Prevable>({ basePrev: isFunction })
export const isNextable = structCheck<Nextable>({ next: isFunction })
export const isPrevable = structCheck<Prevable>({ prev: isFunction })
export const hasIsCurrEnd = structCheck<IsEndCurrable>({ isCurrEnd: isFunction })
export const hasIsCurrStart = structCheck<IsStartCurrable>({ isCurrStart: isFunction })

export * as TransformedStream from "./TransformedStream/utils.js"
export * as RewindableStream from "./RewindableStream/utils.js"
export * as ReversibleStream from "./ReversibleStream/utils.js"
export * as PreBasicStream from "./PreBasicStream/utils.js"
export * as PositionalStream from "./PositionalStream/utils.js"
export * as NavigableStream from "./NavigableStream/utils.js"
export * as LimitedStream from "./LimitedStream/utils.js"
export * as FinishableStream from "./FinishableStream/utils.js"
export * as CopiableStream from "./CopiableStream/utils.js"
export * as BasicStream from "./BasicStream/utils.js"
