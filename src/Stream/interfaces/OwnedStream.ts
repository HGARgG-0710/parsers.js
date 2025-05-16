import type { IOwnerSettable, IResourceSettable } from "../../interfaces.js"
import type {
	IResourcefulStream,
	IStatefulStream,
	IStream
} from "../../interfaces/Stream.js"
import type {
	IRecursiveListIdentifiable,
	ISwitchIdentifiable
} from "../../internal/RecursiveInitList.js"

export type IOwnedStream<Type = any> = IStream<Type> &
	IOwnerSettable & {
		readonly owner?: IOwningStream
	}

export interface IOwningStream<Type = any>
	extends IResourcefulStream<Type>,
		IResourceSettable {
	init(resource?: IOwnedStream, ...x: any[]): this
}

export type ILinkedStream<Type = any> = IOwnedStream<Type> &
	IOwningStream<Type> &
	// * Note: these two exist "UNOFFICIALLY"...
	ISwitchIdentifiable &
	IRecursiveListIdentifiable

export type IControlStream<Type = any> = ILinkedStream<Type> &
	IStatefulStream<Type>
