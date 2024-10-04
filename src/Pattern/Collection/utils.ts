import { object, typeof as type, boolean } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type
const { T } = boolean

import type { Collection } from "./interfaces.js"
import { isIterable } from "src/Stream/StreamClass/Iterable/utils.js"

export const isPlainCollection = structCheck<Collection>({
	push: isFunction,
	value: T
})

export function isCollection<Type = any>(x: any): x is Collection<Type> {
	return isPlainCollection(x) && isIterable(x)
}
