import type { Collection } from "./interfaces.js"

import { object, type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type

/**
 * Returns whether the given `x` is a `Collection`
 */
export const isCollection = structCheck<Collection>({
	get: isFunction,
	push: isFunction
}) as <Type = any>(x: any) => x is Collection<Type>

export * as Buffer from "./Buffer/utils.js"
