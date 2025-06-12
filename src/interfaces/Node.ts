import type {
	ICopiable,
	IFreeable,
	IInitializable,
	ISerializableObject
} from "../interfaces.js"

export interface ITyped<T = any> {
	readonly type: T
}

export interface IValued<V = any> {
	readonly value: V
}

export interface IChildrenHaving<T = any> {
	readonly children: T[]
}

export interface ITypeCheckable {
	is: (x: any) => boolean
}

export interface IWalkable<T extends IWalkable<T> = any> extends ICopiable {
	readonly lastChild: number
	read: (index: number) => T
	index: (multindex: readonly number[]) => T
	backtrack: (positions: number) => T | null
	findUnwalkedChildren: (startIndex: readonly number[]) => number
}

export interface INodeClass<T = any, Args extends any[] = any[]>
	extends ITyped<T>,
		ITypeCheckable,
		INodeType<T, Args> {
	new (...x: Args): INode<T, Args>
}

export interface ICellNodeClass<T = any, V = any> extends INodeClass<T, [V]> {
	new (value: V): ICellNode<T, V>
}

export interface IRecursiveNodeClass<T = any>
	extends INodeClass<T, [INode<T>]> {
	new (children: INode<T>[]): IRecursiveNode<T>
}

export interface INode<T = any, Args extends any[] = any[]>
	extends ITyped<T>,
		IWalkable<INode<T>>,
		ISerializableObject,
		IInitializable<Args>,
		Partial<IFreeable> {
	parent: INode<T> | null
}

export interface IRecursiveNode<T = any> extends INode<T, [INode<T>[]]> {
	jsonInsertablePre(): [string, string]
	jsonInsertableEmpty(): [string, string]
	jsonInsertablePost(): [string, string]
}

export interface ICellNode<T = any, V = any> extends INode<T>, IValued<V> {}

export type INodeMaker<T = any> = (x: any) => INode<T> | false

export interface INodeType<T = any, Args extends any[] = any[]> {
	new (...args: Args): INode<T>
	fromPlain(x: any, maker: INodeMaker<T>): INode<T> | false
}

export interface IRecursiveNodeType<T = any, Args extends any[] = any[]>
	extends INodeType<T, Args> {
	new (...args: Args): IRecursiveNode<T>
	fromPlain(x: any, maker: INodeMaker<T>): INode<T> | false
}

export type INodeTypeFactory<T = any, Args extends any[] = any[]> = (
	type: T
) => INodeType<T, Args>

export type IRecursiveNodeTypeFactory<T = any, Args extends any[] = any[]> = (
	type: T
) => IRecursiveNodeType<T, Args>

export type INodeTypeCategories<T = any> = [INodeTypeFactory, T[]][]

export type INodeTypesMap<T = any> = Map<T, INodeType<T>>
