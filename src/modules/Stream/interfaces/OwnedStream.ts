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

export type IOwnedStream<T = any> = IStream<T> &
	IOwnerSettable & {
		readonly owner?: IOwningStream
	}

export interface IOwningStream<T = any>
	extends IResourcefulStream<T>,
		IResourceSettable {
	init(resource?: IOwnedStream, ...x: any[]): this
}

export type ILinkedStream<T = any> = IOwnedStream<T> &
	IOwningStream<T> &
	// * Note: these two exist "UNOFFICIALLY"...
	ISwitchIdentifiable &
	IRecursiveListIdentifiable

export type IControlStream<T = any> = ILinkedStream<T> &
	IStatefulStream<T>
