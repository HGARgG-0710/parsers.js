import type { IPoolGetter } from "../interfaces/PoolGetter.js"
import type { ObjectPool } from "./ObjectPool.js"

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
