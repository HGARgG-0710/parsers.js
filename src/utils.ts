import { object, type } from "@hgargg-0710/one"
import { BadIndex } from "./constants.js"
import type { ICopiable, IFreeable, IResource } from "./interfaces.js"

const { isFunction } = type
const { structCheck } = object

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

/**
 * Returns whether the given item is `ICopiable`.
 */
export const isCopiable = structCheck<ICopiable>({ copy: isFunction })

/**
 * Carries out a conditional call to `x.copy()` if it
 * can be made.
 */
export function tryCopy<T = any>(x: T) {
	return isCopiable(x) ? x.copy() : x
}

/**
 * Returns whether a given item is `IFreeable`.
 */
export const isFreeable = structCheck<IFreeable>({ free: isFunction })

export * as Debug from "./utils/Debug.js"
export * as IndexMap from "./utils/IndexMap.js"
export * as Node from "./utils/Node.js"
export * as Step from "./utils/Step.js"
export * as Stream from "./utils/Stream.js"
