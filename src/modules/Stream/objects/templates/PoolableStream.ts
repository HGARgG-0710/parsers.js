import type {
	IFreeable,
	IInitializable,
	IStream
} from "../../../../interfaces.js"
import type { ObjectPool } from "../../../../objects.js"

/**
 * This is an abstract class implementing `IStream<T>`, `IInitializable` and `IFreeable`.
 * It provides the `free(): void` method, which is intended to be used for reclamation of
 * the object and subsequent reuse via pooling. It also provides a
 * `protected abstract readonly pool: ObjectPool<IStream<T> & IInitializable<Args>`,
 * which is the pool used by the `free()` method like `this.pool.free(this)`.
 *
 * The intention is that the deriving classes would create class-specific `ObjectPool`
 * objects and then assign them to their instances `pool` property via the
 * `protected get pool()`-style accessor.
 */
export abstract class PoolableStream<T = any, Args extends any[] = any[]>
	implements IFreeable, IInitializable<Args>, IStream<T>
{
	protected abstract readonly pool: ObjectPool<
		IStream<T> & IInitializable<Args>
	>

	abstract readonly isEnd: boolean
	abstract readonly curr: T
	abstract next(): void
	abstract isCurrEnd(): boolean

	abstract init(...args: Partial<Args> | []): this

	free(): void {
		this.pool.free(this)
	}
}
