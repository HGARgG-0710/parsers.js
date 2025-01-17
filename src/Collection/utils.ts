import type { Collection } from "./interfaces.js"

import { object, boolean, type } from "@hgargg-0710/one"
const { structCheck } = object
const { T } = boolean
const { isFunction } = type

export const isCollection = structCheck<Collection>({
	value: T,
	push: isFunction
}) as <Type = any>(x: any) => x is Collection<Type>

export * as Buffer from "./Buffer/utils.js"
