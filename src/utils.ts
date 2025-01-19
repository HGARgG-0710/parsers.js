import type { PredicatePosition } from "./Position/interfaces.js"
import type { Indexed } from "./Stream/interfaces.js"

import { BadIndex } from "./constants.js"
import { propByName } from "./Stream/refactor.js"

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

export const length = propByName("length")

export const size = propByName("size")

export const state = propByName("state")

export const buffer = propByName("buffer")

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
