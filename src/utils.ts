import type { Summat } from "@hgargg-0710/summat.ts"

import type { Bufferized, FreezableBuffer, Indexed, Sizeable } from "./interfaces.js"
import type { Stateful } from "./Stream/StreamClass/interfaces.js"
import type { Posed } from "./Position/interfaces.js"

import { BadIndex } from "./constants.js"

import { object } from "@hgargg-0710/one"
const { prop } = object

/**
 * Returns whether or not the given `number` is greater than `BadIndex`
 */
export const isGoodIndex = (x: number) => x > BadIndex

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
export const length = prop("length") as <Type = any>(x: Indexed<Type>) => number

/**
 * Returns the `.size` of the given `Sizeable` object
 */
export const size = prop("size") as (x: Sizeable) => number

/**
 * Returns the `.state` of the given `Stateful`
 */
export const state = prop("state") as (x: Stateful) => Summat

/**
 * Returns the `.buffer` property of the given `Bufferized`
 */
export const buffer = prop("buffer") as <Type = any>(
	x: Bufferized<Type>
) => FreezableBuffer<Type>

/**
 * Returns the `.pos` property of the given `Posed` object
 */
export const pos = prop("pos") as <Type = any>(x: Posed<Type>) => Type

export * as Collection from "./Collection/utils.js"
export * as EnumSpace from "./EnumSpace/utils.js"
export * as IndexMap from "./IndexMap/utils.js"
export * as Parser from "./Parser/utils.js"
export * as Pattern from "./Pattern/utils.js"
export * as Position from "./Position/utils.js"
export * as Stream from "./Stream/utils.js"
export * as Token from "./Token/utils.js"
export * as Tokenizable from "./Tokenizable/utils.js"
export * as Tree from "./Tree/utils.js"
export * as Validatable from "./Validatable/utils.js"
