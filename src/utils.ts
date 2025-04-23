import { boolean, object, type } from "@hgargg-0710/one"
import type { Summat } from "@hgargg-0710/summat.ts"
import type { IPattern } from "src/interfaces.js"
import { BadIndex } from "./constants.js"
import type {
	IBufferized,
	IFreezableBuffer,
	IIndexAssignable,
	IIndexed,
	IPointer,
	ISizeable,
	IStateful
} from "./interfaces.js"
import type { IPosed } from "./Stream/Position/interfaces.js"

const { isUndefined } = type
const { structCheck, prop } = object
const { eqcurry } = boolean

/**
 * Returns whether or not the given `number` is greater than `BadIndex`
 */
export const isGoodIndex = (x: number) => x > BadIndex

/**
 * Returns whether a certain index-pointer has been invalidated
 */
export const isGoodPointer = (x: IPointer<number>) => isGoodIndex(x.value)

/**
 * Given a string, returns whether it's a valid hexidecimal number
 */
export const isHex = (x: string) => /^[0-9A-Fa-f]+$/.test(x)

/**
 * Given a string, return whether it's a valid decimal number
 */
export const isDecimal = (x: string) => /^[0-9]+$/.test(x)

/**
 * Returns the `.length` of the given `Indexed` object
 */
export const length = prop("length") as <Type = any>(
	x: IIndexed<Type>
) => number

/**
 * Returns the `.size` of the given `Sizeable` object
 */
export const size = prop("size") as (x: ISizeable) => number

/**
 * Returns the `.state` of the given `Stateful`
 */
export const state = prop("state") as (x: IStateful) => Summat

/**
 * Returns the `.buffer` property of the given `Bufferized`
 */
export const buffer = prop("buffer") as <Type = any>(
	x: IBufferized<Type>
) => IFreezableBuffer<Type>

/**
 * Returns the `.pos` property of the given `Posed` object
 */
export const pos = prop("pos") as <Type = any>(x: IPosed<Type>) => Type

/**
 * Sets the value of the `x.assignedIndex` property to `assignedIndex`
 */
export const assignIndex = <Type = any>(
	x: IIndexAssignable<Type>,
	assignedIndex: Type
) => (x.assignedIndex = assignedIndex)

/**
 * Returns whether the given value is an `IPointer`
 */
export const isPoiner = structCheck<IPointer>(["value"]) as <T = any>(
	x: any
) => x is IPointer<T>

/**
 * Returns the `.value` property of the given `Pattern`
 */
export const value = prop("value") as <Type = any>(
	x: IPattern<Type>
) => Type | undefined

/**
 * Sets the `.value` property of a given `Pattern`
 */
export const setValue = <Type = any>(x: IPattern<Type>, value?: Type) =>
	(x.value = value)

/**
 * Unless given `value` is `undefined`, calls `setValue(pattern, value)`
 */
export function optionalValue(pattern: IPattern, value?: any) {
	if (!isUndefined(value)) setValue(pattern, value)
}

/**
 * Swaps `.value`s of two given `Pattern`s
 */
export function swapValues<Type = any>(x: IPointer<Type>, y: IPointer<Type>) {
	const temp = x.value
	x.value = y.value
	y.value = temp
}

export const isLF = eqcurry("\n")

export * as Collection from "./Collection/utils.js"
export * as EnumSpace from "./EnumSpace/utils.js"
export * as HashMap from "./HashMap/utils.js"
export * as IndexMap from "./IndexMap/utils.js"
export * as Node from "./Node/utils.js"
export * as Stream from "./Stream/utils.js"
