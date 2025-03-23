import type { ICopiable, IPattern } from "../interfaces.js"

export interface ITyped<Type = any> {
	type: Type
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

export interface INodeClass<Type = any, Value = any> extends ITypeCheckable {
	new (...x: any[]): INode<Type, Value>
}

export interface INode<Type = any, Value = any>
	extends ICopiable,
		ITyped<Type>,
		IPattern<Value>,
		IWalkable<INode<Type, Value>> {
	parent: INode<Type, Value> | null

	set: (node: INode<Type, Value>, i: number) => this
	write: (node: INode<Type, Value>, multindex: readonly number[]) => this

	insert: (node: INode<Type, Value>, index?: number) => this
	remove: (index?: number) => this
}
