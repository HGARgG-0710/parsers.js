import type { IIndexAssignable } from "../../interfaces.js"
import type { IEndableStream } from "../interfaces.js"
import type { IOwnedStream } from "./OwnedStream.js"

export interface INestedStream<Type = any, IndexType = any>
	extends IOwnedStream<Type | INestedStream<Type, IndexType>>,
		IIndexAssignable<IndexType> {
	readonly currNested: boolean
	setIndex(index: IndexType): INestedStream<Type, IndexType>
}

export type IUnderNestedStream<Type = any> = IOwnedStream<Type> &
	IEndableStream<Type>

export type INestedElement<Type = any, IndexType = any> =
	| Type
	| INestedStream<Type, IndexType>
