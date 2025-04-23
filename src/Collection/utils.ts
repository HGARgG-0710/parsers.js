import { object, type } from "@hgargg-0710/one"
import type { ICollection } from "./interfaces.js"

const { structCheck } = object
const { isFunction, isNumber } = type

/**
 * Returns whether the given `x` is a `Collection`
 */
export const isCollection = structCheck<ICollection>({
	get: isFunction,
	push: isFunction,
	copy: isFunction,
	size: isNumber,
	[Symbol.iterator]: isFunction
}) as <Type = any>(x: any) => x is ICollection<Type>

export * as Buffer from "./Buffer/utils.js"

