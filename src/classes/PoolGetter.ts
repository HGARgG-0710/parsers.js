import type { ITyped } from "../interfaces.js"
import type { IPoolGetter } from "../interfaces/PoolGetter.js"
import type { ObjectPool } from "./ObjectPool.js"

export class TypedPoolKeeper<T = any> implements IPoolGetter<ITyped<T>> {
	private readonly pools = new Map<T, ObjectPool>()

	has(type: T) {
		return this.pools.has(type)
	}

	set(key: T, pool: ObjectPool) {
		this.pools.set(key, pool)
	}

	getByType(key: T) {
		return this.pools.get(key)
	}

	get(key: ITyped<T>) {
		return this.getByType(key.type)
	}
}
