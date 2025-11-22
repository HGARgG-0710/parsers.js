import type { OwnableStream } from "./OwnableStream.ts"

/**
 * This is a mixin of `OwnableStream` and `IterableStream`
 * classes. Exists solely for convinience purposes - almost
 * any real-life stream will want to have these two traits,
 * while not necessarily wanting all of the others, therefore
 * it makes sense to combine them.
 */
export declare abstract class PreCommonStream<T = any>
	extends OwnableStream<T>
	implements Iterable<T>
{
	[Symbol.iterator](): Generator<T>
}
