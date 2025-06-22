import { boolean } from "@hgargg-0710/one"
import { BadIndex } from "./constants.js"
import type { IGettable, IResource } from "./interfaces.js"

const { eqcurry } = boolean

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
 * Returns whether or not the given `y === "\n"`
 */
export const isLF = eqcurry("\n")

/**
 * Executes and returns `callback(resource)`,
 * calling `resource.cleanup()` right after.
 */
export function withResource<T = any>(
	resource: IResource,
	callback: (r: IResource) => T
) {
	const retval = callback(resource)
	resource.cleanup()
	return retval
}

/**
 * Returns `x.get()`
 */
export function get<T = any>(x: IGettable<T>) {
	return x.get()
}

export * as IndexMap from "./utils/IndexMap.js"
export * as Node from "./utils/Node.js"
export * as Position from "./utils/Position.js"
export * as Stream from "./utils/Stream.js"
