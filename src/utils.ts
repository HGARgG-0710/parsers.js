import { BadIndex } from "./constants.js"
import type { IResource } from "./interfaces.js"

/**
 * Returns whether or not the given `number` is greater than `BadIndex`
 */
export const isGoodIndex = (x: number) => x > BadIndex

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

export * as IndexMap from "./utils/IndexMap.js"
export * as Node from "./utils/Node.js"
export * as Position from "./utils/Position.js"
export * as Stream from "./utils/Stream.js"
