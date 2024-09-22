import type {
	Inflatable,
	Deflatable,
	Nestable,
	NestedStream,
	CurrNestedCheckable,
	Toplevel,
	BasicNested
} from "./interfaces.js"
import { isInputted } from "../UnderStream/utils.js"

import { object, typeof as type, function as f } from "@hgargg-0710/one"
import { isIterableStream } from "../IterableStream/utils.js"
const { structCheck } = object
const { isFunction, isBoolean } = type
const { and } = f

export const isNestable = structCheck<Nestable>({ nest: isFunction })
export const isInflatable = structCheck<Inflatable>({ inflate: isFunction })
export const isDeflatable = structCheck<Deflatable>({ deflate: isFunction })
export const isCurrNestedCheckable = structCheck<CurrNestedCheckable>({
	currNested: isBoolean
})
export const isToplevel = structCheck<Toplevel>({ toplevel: isBoolean })

export const isBasicNested = and(isInflatable, isDeflatable, isCurrNestedCheckable) as (
	x: any
) => x is BasicNested

export const isNestedStream = and(isInputted, isBasicNested, isIterableStream) as <
	Type = any
>(
	x: any
) => x is NestedStream<Type>
