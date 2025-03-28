import type { Summat } from "@hgargg-0710/summat.ts"

import type {
	IBufferized,
	IFreezableBuffer,
	IIndexAssignable,
	IIndexed,
	IPointer,
	ISizeable
} from "./interfaces.js"

import type { IStateful } from "./Stream/StreamClass/interfaces.js"
import type { IPosed } from "./Position/interfaces.js"

import { BadIndex } from "./constants.js"

import { object } from "@hgargg-0710/one"
const { prop } = object

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

export * as Collection from "./Collection/utils.js"
export * as EnumSpace from "./EnumSpace/utils.js"
export * as IndexMap from "./IndexMap/utils.js"
export * as Parser from "./Parser/utils.js"
export * as Pattern from "./Pattern/utils.js"
export * as Position from "./Position/utils.js"
export * as Stream from "./Stream/utils.js"
export * as Node from "./Node/utils.js"
