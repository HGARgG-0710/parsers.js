import type { IOwnedStream, IOwningStream } from "../interfaces/OwnedStream.ts"
import type { IRenewerStream } from "../interfaces/RenewerStream.ts"
import type { StatefulStream } from "./StatefulStream.ts"

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
export declare abstract class RenewerStream<T = any, Args extends any[] = []>
	extends StatefulStream<T>
	implements IOwningStream<T, Args>, IRenewerStream<T>
{
	readonly resource?: IOwnedStream
	setResource(resource: IOwnedStream): void
	reviveChild(): boolean
	abstract init(resource?: IOwnedStream, ...args: Partial<Args> | []): this
}
