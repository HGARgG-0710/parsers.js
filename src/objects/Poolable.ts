import type { IFreeable, IPoolable } from "../interfaces.js"
import { BaseInitializable } from "./Initializable.js"
import type { ObjectPool } from "./ObjectPool.js"

// ! PRE-DOC [important]: the `markFree` and `markUsed` methods are NOT TO BE CALLED BY THE USER!!!
// 		This can (and likely will) seriously break the integrity checks of the `.create` and `.free`
// 		methods on 'ObjectPool's (when they are enabled). 
export abstract class BasicPoolable<Args extends any[] = any[]>
	extends BaseInitializable<Args>
	implements IPoolable<Args>
{
	protected abstract readonly pool: ObjectPool<this, Args>
	abstract postFree(): void

	private _isUsed: boolean = true

	get isUsed() {
		return this._isUsed
	}

	markFree(): void {
		this._isUsed = false
	}

	markUsed(): void {
		this._isUsed = true
	}

	get poolId() {
		return this.pool.id
	}
}

export abstract class Poolable<Args extends any[] = any[]>
	extends BasicPoolable<Args>
	implements IFreeable
{
	free(): void {
		this.pool.free(this)
	}
}
