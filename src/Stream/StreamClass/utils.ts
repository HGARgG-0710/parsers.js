import { isStream } from "../BasicStream/utils.js"
import { isPrevable } from "../ReversibleStream/utils.js"
import type {
	IsStartCurrable,
	ReversedStreamClassInstance,
	StreamClassInstance
} from "./interfaces.js"

import { object, typeof as type, boolean, function as _f } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type
const { T } = boolean
const { and } = _f

export const isStartCurr = structCheck<IsStartCurrable>({ isStartCurr: isFunction })

export const isStreamClassInstance = and(
	isStream,
	structCheck({
		isCurrEnd: isFunction,
		baseNextIter: isFunction,
		currGetter: T,
		initGetter: T,
		isStart: T,
		realCurr: T
	})
) as (x: any) => x is StreamClassInstance

export const isReversedStreamClassInstance = and(
	isPrevable,
	isStartCurr,
	isStreamClassInstance
) as (x: any) => x is ReversedStreamClassInstance
