import type { IPoolable } from "../interfaces.js"
import type { ObjectPool } from "./ObjectPool.js"

/**
 * This is a class for representing a collectino of
 * `ObjectPool`s. It contains an `add` method, designed
 * for adding new pools into the collection, as well
 * as `clear()` method, which calls `pool.clear()`
 * for every pool currently present in the collection.
 *
 * The purpose of the `PoolCollection` objects is to serve
 * as a way to combine a multitude of cleanup calls to the
 * `ObjectPool.prototype.clear()` method. Since the library's
 * basic parsing algorithm involves heavy usage of pooling
 * of various `IStream` instances, the pools that contain
 * objects from said parsing must be cleared once given
 * resource (file descriptor, etc) is exhausted.
 */
export class PoolCollection {
	private readonly pools: Set<ObjectPool> = new Set()

	clear() {
		for (const pool of this.pools) pool.clear()
	}

	add<T extends IPoolable<Args> = any, Args extends any[] = any[]>(
		pool: ObjectPool<T, Args>
	) {
		this.pools.add(pool)
		return pool
	}
}

/**
 * This is a class for representing a joint collection
 * of existing `PoolCollection` objects. It has a `clear()`
 * method, which calls `clear()` on each of the
 * `PoolCollection`s given. One can also add a new
 * `PoolCollection` via the `add()` method.
 *
 * Note that any changes to a `PoolCollection` swill also be
 * reflected in all the `JointPoolCollection` that contain them.
 */
export class JointPoolCollection {
	private readonly poolCollections: Set<PoolCollection>

	clear() {
		for (const poolCollection of this.poolCollections)
			poolCollection.clear()
	}

	add(poolCollection: PoolCollection) {
		this.poolCollections.add(poolCollection)
	}

	constructor(...poolCollections: PoolCollection[]) {
		this.poolCollections = new Set(poolCollections)
	}
}
