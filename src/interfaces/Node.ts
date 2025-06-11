import type {
	ICopiable,
	IFreeable,
	IInitializable,
	ISerializableObject
} from "../interfaces.js"

/**
 * This is a type for objects that are capable of
 * being categorized using their `.type: T` property.
 */
export interface ITyped<T = any> {
	readonly type: T
}

/**
 * This is an interface for objects with a `readonly value: V`
 *  property, representing some sort of primitive data-carrier.
 */
export interface IValued<V = any> {
	readonly value: V
}

/**
 * This is an interface for objects with
 * a `readonly children: T[]`, representing some
 * form of child-based tree-like recursive structure.
 */
export interface IChildrenHaving<T = any> {
	readonly children: T[]
}

/**
 * This is an interface for objects that are capable
 * of being used for some kind of runtime type-checking
 * operation using their `.is: (x: any) => boolean` method.
 */
export interface ITypeCheckable {
	is: (x: any) => boolean
}

/**
 * This is a generic interface for tree-like objects that
 * permits:
 *
 * 1. reading a child at a given `index: number`
 * 2. recursive indexation via a `multindex: readonly number[]`
 * 3. backtracking through `positions: number` steps to a parent-`T`
 * 4. finding the next child in a tree that, based on the `startIndex` argument,
 * 	hasn't yet been visited (in the context of a given iteration order)
 */
export interface IWalkable<T extends IWalkable<T> = any> extends ICopiable {
	readonly lastChild: number
	read: (index: number) => T
	index: (multindex: readonly number[]) => T
	backtrack: (positions: number) => T | null
	findUnwalkedChildren: (startIndex: readonly number[]) => number
}

/**
 * This is an interface for representing the classes/factories
 * for creation of `INode<T, Args>` instances. They also carry
 * .type-specific information, and have the ability to deserialize
 * `INode<T>` from some input format.
 */
export interface INodeClass<T = any, Args extends any[] = any[]>
	extends ITyped<T>,
		ITypeCheckable,
		INodeType<T, Args> {
	new (...x: Args): INode<T, Args>
}

/**
 * This interface is intended to represent instances of `INodeClass<T, [V]>`
 * that carry data of type `V`.
 */
export interface ICellNodeClass<T = any, V = any> extends INodeClass<T, [V]> {
	new (value: V): ICellNode<T, V>
}

/**
 * This interface is intended to represent instances of `INodeClass<T, [INode<T>[]]>`,
 * that carry children of type `INode<T>`.
 */
export interface IRecursiveNodeClass<T = any>
	extends INodeClass<T, [INode<T>[]]> {
	new (children: INode<T>[]): IRecursiveNode<T>
}

/**
 * This interface is intended to represent individual nodes
 * inside a Tree-like structure, with `.type: T`. The instances
 * of this interface are intended to be poolable (at least, so
 * far as their ability of being re-`.init(...args: Args)`ialized goes).
 *
 * They are also `ISerializableObject`, so can be used with `JSON.stringify`.
 * Some of them can also be used within the `FreeStream`, or other classes/
 * interfaces that require `IFreeable`.
 */
export interface INode<T = any, Args extends any[] = any[]>
	extends ITyped<T>,
		IWalkable<INode<T>>,
		ISerializableObject,
		IInitializable<Args>,
		Partial<IFreeable> {
	parent: INode<T> | null
}

/**
 * This is an `INode<T, [INode<T>[]]>` with chidlren, that can be
 * "broken down" in its JSON-serialization. It allows to represent a
 * node as various "start-end" pairs of strings, two of which include
 * its children's serializations [`.jsonInsertablePre()` and `.jsonInsertablePost()`],
 * and another [`.jsonInsertableEmpty()`] doesn't.
 */
export interface IRecursiveNode<T = any> extends INode<T, [INode<T>[]]> {
	jsonInsertablePre(): [string, string]
	jsonInsertableEmpty(): [string, string]
	jsonInsertablePost(): [string, string]
}

/**
 * This is an `INode<T>`, carrying data of type `V`
 */
export interface ICellNode<T = any, V = any> extends INode<T>, IValued<V> {}

/**
 * This is a function for creation of `INode<T>` from an `x: any`,
 * or returning `false`, when this is not possible.
 */
export type INodeMaker<T = any> = (x: any) => INode<T> | false

/**
 * This is an interface for representing `INode` -factories without
 * their respective .type-information, but with deserialization capabilities.
 */
export interface INodeType<T = any, Args extends any[] = any[]> {
	new (...args: Args): INode<T>
	fromPlain(x: any, maker: INodeMaker<T>): INode<T> | false
}

/**
 * This is an interface for representing `INodeType<T, Args>` extensions
 * specifically purposed for `IRecursiveNode<T>` instances.
 */
export interface IRecursiveNodeType<T = any, Args extends any[] = any[]>
	extends INodeType<T, Args> {
	new (...args: Args): IRecursiveNode<T>
	fromPlain(x: any, maker: INodeMaker<T>): INode<T> | false
}

/**
 * This is an interface for representing a function-factory for `INodeType<T, Args>`
 * instances.
 */
export type INodeTypeFactory<T = any, Args extends any[] = any[]> = (
	type: T
) => INodeType<T, Args>

/**
 * This is an interface for representing a function-factory for `IRecursiveNodeType<T, Args>`
 */
export type IRecursiveNodeTypeFactory<T = any, Args extends any[] = any[]> = (
	type: T
) => IRecursiveNodeType<T, Args>

/**
 * This is an interface for representing a mapping of an `INodeTypeFactory<T>`
 * to lists of `T[]`. Typically employed to simplify type-creation/maintenance. 
 */
export type INodeTypeCategories<T = any> = [INodeTypeFactory<T>, T[]][]
