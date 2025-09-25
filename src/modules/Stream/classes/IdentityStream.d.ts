import type { ObjectPool } from "../../../classes.ts"
import type { ICommonStream } from "../interfaces/CommonStream.ts"
import type { IOwnedStream } from "../interfaces/OwnedStream.ts"
import type { AttachedStream } from "./AttachedStream.js"

/**
 * This is a (concrete) mixin of:
 *
 * 1. `ResourceCopyingStream`
 * 2. `AttachedStream`
 *
 * It uses the constructor of `AttachedStream`.
 *
 * Extremely useful for usage as a default in
 * `TableHandler`s defining `IStreamChooser`s
 * (since that would just mean to reference the
 * elements from the underlying `IStream` instead
 * of transforming them);
 */
export declare class IdentityStream<T = any, Args extends any[] = any[]>
	extends AttachedStream<T, Args>
	implements ICommonStream<T>
{
	protected ["constructor"]: new (
		resource?: IOwnedStream,
		...args: Partial<Args> | []
	) => this

	static readonly pool: ObjectPool<IdentityStream, [IOwnedStream]>
	protected get pool(): ObjectPool<
		ICommonStream<T>,
		[IOwnedStream, ...(Args | [])]
	>
	free(): void
	copy(): this
}
