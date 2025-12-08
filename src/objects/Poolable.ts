import type { IFreeable } from "../interfaces.js"
import { BaseInitializable } from "./Initializable.js"
import type { ObjectPool } from "./ObjectPool.js"

export abstract class Poolable<Args extends any[] = any[]>
	extends BaseInitializable<Args>
	implements IFreeable
{
	protected abstract readonly pool: ObjectPool<this, Args>

	free(): void {
		this.pool.free(this)
	}
}
