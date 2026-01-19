import type {
	IInitializer,
	ILinkedStream,
	IOwnedStream,
	IOwningStream,
	IParseState,
	IParseStream
} from "../../../../interfaces.ts"
import type { ObjectPool } from "../../../../objects.ts"
import type { RenewerStream } from "../templates/RenewerStream.js"

/**
 * This is a an abstract class for representing a user-defined stream
 * that may rely on several dead child-streams to produce a single
 * `.next()` call.
 */
export declare abstract class NodeStream<T = any, Args extends any[] = []>
	extends RenewerStream<T, Args>
	implements IParseStream<T>
{
	isCurrEnd(): boolean

	connectOwner(newOwner: IOwningStream): void
	get owner(): IOwningStream | null

	readonly state: IParseState
	setState(state: IParseState): void

	protected set resource(newResource: ILinkedStream | null)
	get resource(): ILinkedStream | null
	connectResource(resource: ILinkedStream): void
	baseInit(): void
	init(resource?: IOwnedStream, ...args: Partial<Args> | []): this

	protected endStream(): void
	protected startStream(): void
	protected set curr(newCurr: T)
	protected set isEnd(newCurr: boolean)
	get curr(): T
	get isEnd(): boolean

	protected resetState(): void
	protected resetCurr(): void
	protected resetIsEnd(): void

	[Symbol.iterator](): Generator<T>

	protected get initializer(): IInitializer<[IOwnedStream, ...([] | Args)]>
	protected get pool(): ObjectPool<NodeStream, [IOwnedStream?]> | undefined

	init(resource?: IOwnedStream, ...args: Partial<Args> | []): this
	copy(): this
	free(): void
	get poolId(): number
	postFree(): void
}
