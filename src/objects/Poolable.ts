import type { IFreeable, IPoolable } from "../interfaces.js"
import { BaseInitializable } from "./Initializable.js"
import type { ObjectPool } from "./ObjectPool.js"

export abstract class Poolable<Args extends any[] = any[]>
	extends BaseInitializable<Args>
	implements IPoolable<Args>, IFreeable
{
	protected abstract readonly pool: ObjectPool<this, Args>

	abstract postFree(): void

	get poolId() {
		return this.pool.id
	}

	free(): void {
		this.pool.free(this)
	}
}
