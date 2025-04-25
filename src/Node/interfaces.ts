import type {
	ICopiable,
	IPointer,
	ISerializableObject
} from "../interfaces.js"

export interface ITyped<Type = any> {
	readonly type: Type
}

export interface ITypeCheckable {
	is: (x: any) => boolean
}

export interface IWalkable<Type extends IWalkable<Type> = any> {
	readonly lastChild: number
	read: (index: number) => Type
	index: (multindex: readonly number[]) => Type
	backtrack: (positions: number) => Type | null
	findUnwalkedChildren: (startIndex: readonly number[]) => number
}

export interface INodeClass<Type = any> extends ITyped<Type>, ITypeCheckable {
	new (...x: any[]): INode<Type>
}

export interface INode<Type = any>
	extends ICopiable,
		ITyped<Type>,
		IWalkable<INode<Type>>,
		ISerializableObject {
	parent: INode<Type> | null

	set: (node: INode<Type>, i: number) => this
	write: (node: INode<Type>, multindex: readonly number[]) => this

	insert: (node: INode<Type>, index?: number) => this
	remove: (index?: number) => this
}

export interface ICellNode<Type = any, Value = any>
	extends INode<Type>,
		IPointer<Value> {}
