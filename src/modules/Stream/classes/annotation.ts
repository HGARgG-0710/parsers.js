import type { IStream } from "../../../interfaces.js"

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
 * deriving annotation class will implement the `IStream<T>`.
 */
export abstract class annotation<T = any> implements IStream<T> {
	abstract readonly isEnd: boolean
	abstract readonly curr: T
	abstract next(): void
	abstract isCurrEnd(): boolean
	abstract [Symbol.iterator](): Generator<T>
}
