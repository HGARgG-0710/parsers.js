import type { ICollection } from "./interfaces.js"

import { object, type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type

/**
 * Returns whether the given `x` is a `Collection`
 */
export const isCollection = structCheck<ICollection>({
	get: isFunction,
	push: isFunction,
	copy: isFunction,
	[Symbol.iterator]: isFunction
}) as <Type = any>(x: any) => x is ICollection<Type>

export * as Buffer from "./Buffer/utils.js"
