import { array, type } from "@hgargg-0710/one"
import type { IPreMap } from "../../interfaces/PreMap.js"

const { isUndefined } = type

/**
 * This is a class implementing the `IPreMap<K, V, Default>` interface.
 * It is a thin wrapper around `Map<K, V>`.
 * It is intended to be used by the `HashClass` for the purposes
 * of defining the hash-operations.
 */
export class MapInternal<K = any, V = any, Default = any>
	implements IPreMap<K, V, Default>
{
	private ["constructor"]: new (
		map?: array.Pairs<K, V> | Map<K, V>,
		_default?: Default
	) => this

	private readonly map: Map<K, V>
	readonly default: Default

	get(x: K) {
		const gotten = this.map.get(x)
		return isUndefined(gotten) ? this.default : gotten
	}

	get size() {
		return this.map.size
	}

	set(key: K, value: V) {
		this.map.set(key, value)
		return this
	}

	delete(key: K) {
		this.map.delete(key)
		return this
	}

	rekey(fromKey: K, toKey: K) {
		const value = this.get(fromKey)
		if (value !== this.default) {
			this.delete(fromKey)
			this.set(toKey, value as V)
		}
		return this
	}

	copy() {
		return new this.constructor(this.map, this.default)
	}

	constructor(mapIterable: Iterable<[K, V]> = new Map(), _default?: Default) {
		this.map = new Map(mapIterable)
		this.default = _default!
	}
}
