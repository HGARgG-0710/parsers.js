import type {
	ICopiable,
	IFreeable,
	IInitializable,
	ISerializableObject
} from "../interfaces.js"

export interface ITyped<Type = any> {
	readonly type: Type
}

export interface IValued<Value = any> {
	readonly value: Value
}

export interface IChildrenHaving<Type = any> {
	readonly children: Type[]
}

export interface ITypeCheckable {
	is: (x: any) => boolean
}

export interface IWalkable<Type extends IWalkable<Type> = any>
	extends ICopiable {
	readonly lastChild: number
	read: (index: number) => Type
	index: (multindex: readonly number[]) => Type
	backtrack: (positions: number) => Type | null
	findUnwalkedChildren: (startIndex: readonly number[]) => number
}

export interface INodeClass<Type = any, Args extends any[] = any[]>
	extends ITyped<Type>,
		ITypeCheckable,
		INodeType<Type, Args> {
	new (...x: Args): INode<Type, Args>
}

export interface ICellNodeClass<Type = any, Value = any>
	extends INodeClass<Type, [Value]> {
	new (value: Value): ICellNode<Type, Value>
}

export interface IRecursiveNodeClass<Type = any>
	extends INodeClass<Type, [INode<Type>]> {
	new (children: INode<Type>[]): IRecursiveNode<Type>
}

export interface INode<Type = any, Args extends any[] = any[]>
	extends ITyped<Type>,
		IWalkable<INode<Type>>,
		ISerializableObject,
		IInitializable<Args>,
		Partial<IFreeable> {
	parent: INode<Type> | null
}

export interface IRecursiveNode<Type = any>
	extends INode<Type, [INode<Type>[]]> {
	jsonInsertablePre(): [string, string]
	jsonInsertableEmpty(): [string, string]
	jsonInsertablePost(): [string, string]
}

export interface ICellNode<Type = any, Value = any>
	extends INode<Type>,
		IValued<Value> {}

export type INodeMaker<Type = any> = (x: any) => INode<Type> | false

export interface INodeType<Type = any, Args extends any[] = any[]> {
	new (...args: Args): INode<Type>
	fromPlain(x: any, maker: INodeMaker<Type>): INode<Type> | false
}

export type INodeTypeFactory<Type = any, Args extends any[] = any[]> = (
	type: Type
) => INodeType<Type, Args>

export type INodeTypeCategories<T = any> = [INodeTypeFactory, T[]][]

export type INodeTypesMap<T = any> = Map<T, INodeType<T>>
