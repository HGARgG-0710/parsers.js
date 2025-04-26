import { boolean, object } from "@hgargg-0710/one"
import type { Summat } from "@hgargg-0710/summat.ts"
import { BadIndex } from "./constants.js"
import type {
	IAccumulator,
	IBufferized,
	IIndexAssignable,
	IIndexed,
	IPointer,
	ISizeable,
	IStateful
} from "./interfaces.js"
import type { IPosed } from "./Stream/Position/interfaces.js"

const { prop } = object
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
) => IAccumulator<Type>

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

export const isLF = eqcurry("\n")

export * as Collection from "./Collection/utils.js"
export * as EnumSpace from "./EnumSpace/utils.js"
export * as HashMap from "./HashMap/utils.js"
export * as IndexMap from "./IndexMap/utils.js"
export * as Node from "./Node/utils.js"
export * as Stream from "./Stream/utils.js"
