import type {
	IRecursiveListIdentifiable,
	ISwitchIdentifiable
} from "src/interfaces.js"
import type { IOwnerSettable, IResourceSettable } from "../../../interfaces.js"
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
export type IOwnedStream<T = any> = IStream<T> &
	IOwnerSettable<IOwningStream> & {
		readonly owner?: IOwningStream
	}

/**
 * This is an `IResourcefulStream<T>`, which is also `IResourceSettable<IOwnedStream>`,
 * and has an `init(resource?: IOwnedStream, ...x: any[])` method signature.
 * It represents a stream that is capable of taking ownership of another stream.
 */
export interface IOwningStream<T = any>
	extends IResourcefulStream<T>,
		IResourceSettable<IOwnedStream> {
	init(resource?: IOwnedStream, ...x: any[]): this
}

/**
 * This is an `IOwnedStream<T>`, which is also `IOwningStream<T>`.
 * This is a fundamental library type, that permits implementation of
 * algorithms and data-structures used in it for parser-representation,
 * and modification.
 */
export type ILinkedStream<T = any> = IOwnedStream<T> &
	IOwningStream<T> &
	// * Note: these two exist "UNOFFICIALLY"...
	ISwitchIdentifiable &
	IRecursiveListIdentifiable

/**
 * This is an `ILinkedStream<T>`, which is also an `IStatefulStream<T>`.
 * It makes sense for a stream to be a `IControlStream<T>` only if the user
 * has the ability to actually access and manipulate/read the said `.state`
 * inside of it. Which is to say, these are the `IStreamChoice`s, where the
 * user actually has direct __control__  over the parser's future developments.
 */
export type IControlStream<T = any> = ILinkedStream<T> & IStatefulStream<T>
