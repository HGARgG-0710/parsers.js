import type { IInitializable, IStream } from "../interfaces.js"

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

export * from "../modules/Stream/classes/ArrayStream.js"
export * from "../modules/Stream/classes/AttachedStream.js"
export * from "../modules/Stream/classes/BasicResourceStream.js"
export * from "../modules/Stream/classes/BasicStream.js"
export * from "../modules/Stream/classes/CompositeStream.js"
export * from "../modules/Stream/classes/ConcatStream.js"
export * from "../modules/Stream/classes/DelegateStream.js"
export * from "../modules/Stream/classes/DepthStream.js"
export * from "../modules/Stream/classes/DyssyncOwningStream.js"
export * from "../modules/Stream/classes/DyssyncStream.js"
export * from "../modules/Stream/classes/FilterStream.js"
export * from "../modules/Stream/classes/FiniteStream.js"
export * from "../modules/Stream/classes/FreeStream.js"
export * from "../modules/Stream/classes/FreezableStream.js"
export * from "../modules/Stream/classes/HandlerStream.js"
export * from "../modules/Stream/classes/IndexStream.js"
export * from "../modules/Stream/classes/InputStream.js"
export * from "../modules/Stream/classes/InterleaveStream.js"
export * from "../modules/Stream/classes/IterableStream.js"
export * from "../modules/Stream/classes/LazyStream.js"
export * from "../modules/Stream/classes/LimitStream.js"
export * from "../modules/Stream/classes/LoopStream.js"
export * from "../modules/Stream/classes/MarkerStream.js"
export * from "../modules/Stream/classes/OwnableStream.js"
export * from "../modules/Stream/classes/OwningStream.js"
export * from "../modules/Stream/classes/PeekStream.js"
export * from "../modules/Stream/classes/PipeStream.js"
export * from "../modules/Stream/classes/PosHavingStream.js"
export * from "../modules/Stream/classes/PosStream.js"
export * from "../modules/Stream/classes/ResourceCopyingStream.js"
export * from "../modules/Stream/classes/SingletonStream.js"
export * from "../modules/Stream/classes/SourceStream.js"
export * from "../modules/Stream/classes/SyncCurrStream.js"
export * from "../modules/Stream/classes/SyncStream.js"
export * from "../modules/Stream/classes/TrivialStream.js"
export * from "../modules/Stream/classes/WrapperStream.js"
export * from "../modules/Stream/classes/WriterStream.js"
