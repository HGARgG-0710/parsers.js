import type { ObjectPool } from "../../../objects.ts"
import type { ICommonStream } from "../interfaces/CommonStream.ts"
import type { IOwnedStream } from "../interfaces/OwnedStream.ts"
import type { PipeStream } from "./PipeStream.js"

/**
 * This is an abstract class, implementing `ILinkedStream<T>`.
 * It is a mixin of `PipeStream` and `SyncStream`, which is
 * to say, it completely and utterly delegates itself onto its
 * `.resource: IOwnedStream`. The purpose of such a class is
 * to allow for easy creation of `ILinkedStream`-classes with
 * very little unique functionality of their own, and which are
 * (however) independent enough to need their own constructor
 * (and, therefore, the copying method).
 *
 * It shares the constructor of `PipeStream`.
 *
 * Extremely useful for usage as a default in
 * `TableHandler`s defining `IStreamChooser`s
 * (since that would just mean to reference the
 * elements from the underlying `IStream` instead
 * of transforming them);
 */
export declare class IdentityStream<T = any, Args extends any[] = []>
	extends PipeStream<T, Args>
	implements ICommonStream<T>
{
	static readonly pool: ObjectPool<IdentityStream, [IOwnedStream]>
	protected get pool(): ObjectPool<
		ICommonStream<T>,
		[IOwnedStream, ...(Args | [])]
	>
	get isEnd(): boolean
	get curr(): T
	free(): void
}
