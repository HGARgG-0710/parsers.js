import type { IOwnerSettable, IResourceful, IStream } from "../interfaces.js"

export type IOwnedStream<Type = any> = IStream<Type> &
	IOwnerSettable & {
		readonly owner?: unknown
	}

export type IRecursiveStream<Type = any> = IOwnedStream<Type> & IResourceful
