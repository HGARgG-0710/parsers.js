import type {
	ICommonStream,
	IInitializer,
	IOwnedStream,
	IOwningStream
} from "../../../../interfaces.ts"
import type { ObjectPool } from "../../../../objects.ts"
import type { RenewerStream } from "./RenewerStream.js"

/**
 * This is a an abstract class for representing a user-defined stream
 * that may rely on several dead child-streams to produce a single
 * `.next()` call.
 */
export declare abstract class NodeStream<T = any, Args extends any[] = []>
	extends RenewerStream<T, Args>
	implements ICommonStream<T>
{
	connectOwner(newOwner: IOwningStream): void
	get owner(): IOwningStream | undefined

	protected endStream(): void
	protected startStream(): void
	protected set curr(newCurr: T)
	protected set isEnd(newCurr: boolean)
	get curr(): T
	get isEnd(): boolean

	[Symbol.iterator](): Generator<T>

	protected get initializer(): IInitializer<[IOwnedStream, ...([] | Args)]>
	protected get pool(): ObjectPool<NodeStream, [IOwnedStream?]> | undefined

	init(resource?: IOwnedStream, ...args: Partial<Args> | []): this
	copy(): this
	free(): void
}
