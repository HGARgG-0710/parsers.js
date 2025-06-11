import type { IPoolGetter } from "../interfaces/PoolGetter.js"
import type { ObjectPool } from "./ObjectPool.js"

/**
 * This is an object for keeping track of multiple pools, 
 * based on some type `T`. It is mostly just a wrapper 
 * around a `Map<T, ObjectPool>` instance. 
 * 
 * Implements `IPoolGetter<T>`
*/
export class TypedPoolKeeper<T = any> implements IPoolGetter<T> {
	private readonly pools = new Map<T, ObjectPool>()

	has(type: T) {
		return this.pools.has(type)
	}

	set(key: T, pool: ObjectPool) {
		this.pools.set(key, pool)
	}

	get(key: T) {
		return this.pools.get(key)
	}
}
