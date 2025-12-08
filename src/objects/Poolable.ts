import type { IFreeable, IInitializable } from "../interfaces.js"
import type { ObjectPool } from "./ObjectPool.js"

export abstract class Poolable<Args extends any[] = any[]>
	implements IFreeable, IInitializable<Args>
{
	protected abstract readonly pool: ObjectPool<typeof this>

	abstract init(...args: Partial<Args> | []): this

	free(): void {
		this.pool.free(this)
	}
}
