import { type } from "@hgargg-0710/one"
import assert from "assert"
import { NotCached } from "../constants.js"
import type { IIndexable, ISettable } from "../interfaces.js"

const { isFunction } = type

export function Autocache<K = any, V = any>(
	cache: ISettable<K, V> & IIndexable<V | typeof NotCached>,
	callback: (x: K) => V
) {
	assert(isFunction(callback))
	return function (x: K) {
		const cached = cache.index(x)
		if (cached === NotCached) {
			const newlyCached = callback(x)
			cache.set(x, newlyCached)
			return newlyCached
		}
		return cached
	}
}
