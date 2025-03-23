import type { ICopiable, IPattern } from "../interfaces.js"

export interface ITyped<Type = any> {
	type: Type
}

// ! REFACTOR THIS ONTO SEPARATE INTERFACES!
// TODO: integrate with `TreeWalker` [instead of the current `ITree`]
export interface INode<Type = any, Value = any>
	extends ICopiable,
		ITyped<Type>,
		IPattern<Value> {
	parent: INode<Type> | null

	readonly lastChild: number

	set: (node: INode<Type, Value>, i: number) => this
	write: (node: INode<Type, Value>, multindex: readonly number[]) => this

	insert: (node: INode<Type, Value>, index?: number) => this
	remove: (index?: number) => this

	read: (index: number) => INode<Type, Value>
	index: (multindex: readonly number[]) => INode<Type>

	findUnwalkedChildren: (startIndex: readonly number[]) => number
	backtrack: (positions: number) => INode<Type, Value> | null
}
