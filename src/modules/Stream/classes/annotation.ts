import type { IInitializable, IStream } from "../../../interfaces.js"

/**
 * This is the base "annotation" class for the `IStream`-implementing
 * classes of the library.
 *
 * If ther user has a need to greatly extend the
 * already present collection of classes, and none
 * other existing "annotation" satisfies their
 * needs - this is the most general one.
 *
 * It provides no concrete methods or properties,
 * only `abstract` ones. It also guarantees that the
 * deriving annotation class will implement the `IStream<T>`
 * and `IInitializable<Args>` interfaces
 */
export abstract class annotation<T = any, Args extends any[] = any[]>
	implements IStream<T>, IInitializable<Args>
{
	abstract readonly isEnd: boolean
	abstract readonly isStart: boolean
	abstract readonly curr: T

	abstract next(): void
	abstract isCurrEnd(): boolean
	abstract copy(): this

	abstract init(...args: Partial<Args> | []): this

	abstract [Symbol.iterator](): Generator<T>

	constructor(...x: [] | Partial<Args>) {}
}
