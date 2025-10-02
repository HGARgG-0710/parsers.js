import type { ObjectPool } from "../../../objects.ts"
import type { ICommonStream } from "../interfaces/CommonStream.ts"
import type { IOwnedStream } from "../interfaces/OwnedStream.ts"
import type { ISingletonHandler } from "../interfaces/SingletonStream.ts"

/**
 * This is a function for creating factories for instances
 * of `ILinkedStream<Out>` interface. They represent streams
 * that have a single element, provided by their underlying
 * `.resource: IOwnedStream<In>`, upon which the given `handler`
 * is applied, and from which the sole element of type `Out`
 * is returned.
 */
export declare function SingletonStream<In = any, Out = any>(
	handler: ISingletonHandler<In, Out>
): (resource?: IOwnedStream<In>) => ICommonStream<Out>

export namespace SingletonStream {
	export const pool: ObjectPool<ICommonStream, [IOwnedStream]>
}
