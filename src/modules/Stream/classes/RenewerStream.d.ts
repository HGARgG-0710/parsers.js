import type { IOwnedStream, IOwningStream } from "../interfaces/OwnedStream.ts"
import type { StatefulStream } from "./StatefulStream.ts"

/**
 * This is an `IStream` mixin which is a combination of: 
 * 
 * 1. `OwningStream`
 * 2. `StatefulStream`
 * 
 * It also possesses a unique `reviveChild(): void` method, 
 * which is equivalent to the call of `this.state.parse.renewStream(this.resource)`. 
 * The method basically "revives" a dead child-stream (`this.resource`)
 * of the current stream. The method is added for convinience only, 
 * as it is a moderately frequent operation when dealing with 
 * a stream that combines the results of many child-streams, each 
 * of which must first be completed in sequence before a single `.next()`
 * call to it is over. 
*/
export declare abstract class RenewerStream<T = any, Args extends any[] = []>
	extends StatefulStream<T>
	implements IOwningStream<T, Args>
{
	readonly resource?: IOwnedStream
	setResource(resource: IOwnedStream): void
	reviveChild(): boolean
	abstract init(resource?: IOwnedStream, ...args: Partial<Args> | []): this
}
