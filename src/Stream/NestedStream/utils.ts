import type {
	Inflatable,
	Deflatable,
	Nestable,
	Blowfish,
	NestedStream,
	CurrNestedCheckable
} from "./interfaces.js"
import { isInputted } from "../UnderStream/utils.js"
import { isStream } from "../BasicStream/utils.js"

import { object, typeof as type, function as f } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction, isBoolean } = type
const { and } = f

export const isNestable = structCheck<Nestable>({ nest: isFunction })
export const isInflatable = structCheck<Inflatable>({ inflate: isFunction })
export const isDeflatable = structCheck<Deflatable>({ deflate: isFunction })
export const isCurrNestedCheckable = structCheck<CurrNestedCheckable>({
	currNested: isBoolean
})

export const isBlowfish = and(isInflatable, isDeflatable) as (x: any) => x is Blowfish
export const isNestedStream = and(
	isInputted,
	isCurrNestedCheckable,
	isBlowfish,
	isStream
) as <Type = any>(x: any) => x is NestedStream<Type>
