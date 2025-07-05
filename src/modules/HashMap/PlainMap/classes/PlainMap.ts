import type { IPlainMap } from "../../interfaces/PlainMap.js"

/**
 * It is a thin wrapper around `Map<K, V>` implementing `IPlainMap<K, V>`
 */
export class PlainMap<K = any, V = any> implements IPlainMap<K, V> {
	private ["constructor"]: new (map?: Map<K, V>) => this

	annul(key: K): void {
		this.map.delete(key)
	}

	read(key: K): V | undefined {
		return this.map.get(key)
	}

	write(key: K, value: V) {
		this.map.set(key, value)
	}

	copy() {
		return new this.constructor(new Map(this.map))
	}

	values(): IteratorObject<V> {
		return this.map.values()
	}

	constructor(private readonly map: Map<K, V> = new Map()) {}
}
