import assert from "assert"
import type { IIndexable, ISettable } from "../interfaces.js"
import { type } from "@hgargg-0710/one"

const { isFunction } = type

const NOT_CACHED = undefined

export function Autocache<KeyType = any, ValueType = any>(
	cache: ISettable<KeyType, ValueType> &
		IIndexable<ValueType | typeof NOT_CACHED>,
	callback: (x: KeyType) => ValueType
) {
	assert(isFunction(callback))
	return function (x: KeyType) {
		const cached = cache.index(x)
		if (cached === NOT_CACHED) {
			const newlyCached = callback(x)
			cache.set(x, newlyCached)
			return newlyCached
		}
		return cached
	}
}
