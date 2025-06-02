import { type } from "@hgargg-0710/one"
import assert from "assert"
import { NotCached } from "../constants.js"
import type { IIndexable, ISettable } from "../interfaces.js"

const { isFunction } = type

export function Autocache<KeyType = any, ValueType = any>(
	cache: ISettable<KeyType, ValueType> &
		IIndexable<ValueType | typeof NotCached>,
	callback: (x: KeyType) => ValueType
) {
	assert(isFunction(callback))
	return function (x: KeyType) {
		const cached = cache.index(x)
		if (cached === NotCached) {
			const newlyCached = callback(x)
			cache.set(x, newlyCached)
			return newlyCached
		}
		return cached
	}
}
