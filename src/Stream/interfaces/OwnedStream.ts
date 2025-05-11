import type {
	IOwnerSettable,
	IResourcefulStream,
	IResourceSettable,
	IStream
} from "../interfaces.js"

export type IOwnedStream<Type = any> = IStream<Type> &
	IOwnerSettable & {
		readonly owner?: IOwningStream
	}

export interface IOwningStream<Type = any>
	extends IResourcefulStream<Type>,
		IResourceSettable {
	init(resource: IOwnedStream, ...x: any[]): this
}

export type ILinkedStream<Type = any> = IOwnedStream<Type> & IOwningStream<Type>
