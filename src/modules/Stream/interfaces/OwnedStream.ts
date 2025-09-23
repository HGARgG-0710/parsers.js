import type {
	IFreeable,
	IOwnerSettable,
	IResourceSettable
} from "../../../interfaces.js"
import type {
	IResourcefulStream,
	IStatefulStream,
	IStream
} from "../../../interfaces/Stream.js"

/**
 * This is an `IStream<T>`, which is also `IOwnerSettable<IOwningStream>`, and
 * has a `readonly owner?: IOwningStream` property. It represents a stream,
 * which can be taken ownership of.
 */
export type IOwnedStream<
	T = any,
	OwnerType extends IOwningStream = IOwningStream
> = IStream<T> &
	IOwnerSettable<IOwningStream> & {
		readonly owner?: OwnerType
	}

/**
 * This is an `IResourcefulStream<T>`, which is also `IResourceSettable<IOwnedStream>`,
 * and has an `init(resource?: IOwnedStream, ...x: any[])` method signature.
 * It represents a stream that is capable of taking ownership of another stream.
 */
export interface IOwningStream<T = any, Args extends any[] = any[]>
	extends IResourcefulStream<T>,
		IResourceSettable<IOwnedStream> {
	init(resource?: IOwnedStream, ...x: Partial<Args> | []): this
}

/**
 * This is an `IOwnedStream<T>`, which is also `IOwningStream<T>`,
 * and an `IFreeable`.
 *
 * This is a fundamental library type, that permits implementation of
 * algorithms and data-structures used in it for parser-representation,
 * and modification.
 *
 * The `free()` method is not obliged to perform any meaningful work,
 * although it is still required in order to adhere to the algorithm.
 * The library-provided classes typically implement pool-based freeing
 * mechanisms, that are automatically employed whenever the user creates
 * a new `IStream`-instance.
 *
 * The `Args` corresponds to the additional arguments of the `init` method.
 */
export type ILinkedStream<
	T = any,
	Args extends any[] = any[]
> = IOwnedStream<T> & IOwningStream<T, Args> & IFreeable

/**
 * This is an `ILinkedStream<T>`, which is also an `IStatefulStream<T>`.
 * It makes sense for a stream to be a `IControlStream<T>` only if the user
 * has the ability to actually access and manipulate/read the said `.state`
 * inside of it. Which is to say, these are the `ILinkedStream`s, where the
 * user actually has direct __control__  over the parser's future developments.
 */
export type IControlStream<T = any> = ILinkedStream<T> & IStatefulStream<T>
