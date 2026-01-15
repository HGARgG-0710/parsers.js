import type { IParseState, IStateful } from "../../../../interfaces.js"
import type {
	ILinkedStream,
	IOwnedStream,
	IOwningStream
} from "../../interfaces/OwnedStream.js"
import type { IRenewerStream } from "../../interfaces/RenewerStream.js"

/**
 * This is an `IStream` mixin which is a combination of:
 *
 * 1. `OwningStream`
 * 2. `StatefulStream`
 *
 * It also possesses a unique `reviveChild(): void` method
 * of `IRenewerStream<T>` interface for reviving `this.resource`,
 * which is implemented as the call to `this.state.parse.renewStream(this.resource)`.
 */
export abstract class RenewerStream<T = any, Args extends any[] = []>
	implements IRenewerStream<T>, IStateful<IParseState>, ILinkedStream<T>
{
	reviveChild(): boolean {
		return this.state.parse.renewStream(this.resource!)
	}

	abstract readonly isEnd: boolean
	abstract readonly curr: T
	abstract isCurrEnd(): boolean
	abstract next(): void

	abstract readonly state: IParseState
	abstract setState(state: IParseState): void

	abstract readonly resource: ILinkedStream | undefined
	abstract connectResource(resource: ILinkedStream): void
	abstract baseInit(): void
	abstract init(resource?: IOwnedStream, ...args: Partial<Args> | []): this

	abstract connectOwner(newOwner: IOwningStream<any, any[]>): void
	abstract free(): void
}
