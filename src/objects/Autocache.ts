import { type } from "@hgargg-0710/one"
import assert from "assert"
import { NotCached } from "../constants.js"
import type { IIndexable, ISettable } from "../interfaces.js"

const { isFunction } = type

/**
 * A function for creation of "automatic" collection types
 * based off `cache: ISettable<K, V> & IIndexable<V | typeof NotCached>`.
 *
 * Upon being given an item `x: K`, it tries to `.index(x)` using
 * the provided `cache`.
 *
 * If the call returns `NotCached`,
 * the item `x` is interpreted as missing, and is (then)
 * calculated a new `y: V` for, by using the provided `callback`
 * argument on it. The resulting `y` is then added to the
 * `cache` using the `cache.set(x, y)` call, while also
 * being returned to the calling party.
 *
 * If the `.index(x)` call does not return `NotCached`,
 * the item is interpreted as present, and
 * the result of the call to the result of `Autocache`
 * becomes the result of the call to `.index(x)`.
 */
export function AutoCache<K = any, V = any, Other extends any[] = any[]>(
	cache: ISettable<K, V> & IIndexable<K, V | typeof NotCached>,
	callback: (x: K, ...y: Other) => V
) {
	assert(isFunction(callback))
	return function (x: K, ...y: Other) {
		const cached = cache.index(x, ...y)
		if (cached === NotCached) {
			const newlyCached = callback(x, ...y)
			cache.set(x, newlyCached)
			return newlyCached
		}
		return cached
	}
}
