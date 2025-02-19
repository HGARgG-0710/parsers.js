import type { PredicatePosition } from "./Position/interfaces.js"
import type { Indexed } from "./Stream/interfaces.js"

import { BadIndex } from "./constants.js"

import { object } from "@hgargg-0710/one"
const { prop } = object

export const isGoodIndex = (x: number) => x > BadIndex

/**
 * Given a string, returns whether it's a Hex number
 */
export const isHex = (x: string) => /^[0-9A-Fa-f]+$/.test(x)

/**
 * Adds a `.direction = false` property on a given `PredicatePosition`
 */
export const backtrack = (predicate: PredicatePosition) => {
	predicate.direction = false
	return predicate
}

export const lastIndex = (x: Indexed) => x.length - 1

export const length = prop("length")

export const size = prop("size")

export const state = prop("state")

export const buffer = prop("buffer")

export * as Collection from "./Collection/utils.js"
export * as IndexMap from "./IndexMap/utils.js"
export * as Parser from "./Parser/utils.js"
export * as Pattern from "./Pattern/utils.js"
export * as Position from "./Position/utils.js"
export * as Stream from "./Stream/utils.js"
export * as Token from "./Token/utils.js"
export * as Tokenizable from "./Tokenizable/utils.js"
export * as Tree from "./Tree/utils.js"
export * as Validatable from "./Validatable/utils.js"
