import type {
	IFreeable,
	IInitializable,
	IJSONSerializableObject,
	IPushable,
	IXMLSerializable
} from "../interfaces.js"
import type { ObjectPool } from "../objects.js"
import type { IDebugNamed, IDebugPrintable } from "./Debug.js"

export type IValidNodeType = string | number

/**
 * This is a type for objects that are capable of
 * being categorized using their `.type: T` property.
 */
export interface ITyped {
	readonly type: IValidNodeType
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
export interface ITypeCheckable<T = any> {
	is(x: T): boolean
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
export interface IWalkable<T extends IWalkable<T> = any> {
	readonly lastChild: number
	read(index: number): T
	index(multindex: readonly number[]): T
	backtrack(positions: number): T | null
	findUnwalkedChildren(startIndex: readonly number[]): number
}

export type ITreeMap<T = any, R = boolean> = Map<
	IValidNodeType,
	Map<IValidNodeType, (x: T) => R>
>

export type IValidityMap<T = any> = ITreeMap<T, boolean>

export type IStringPairs = [string, string][]

export interface IValidationTable<T = any> {
	validate(
		parentType: IValidNodeType,
		childType: IValidNodeType,
		child: T
	): boolean
}

export interface IValidatable<T = any> {
	validate(table: IValidationTable<T>): boolean
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
export interface INode
	extends ITyped,
		IWalkable<INode>,
		IJSONSerializableObject,
		IXMLSerializable,
		Partial<IValidatable<INode>>,
		IDebugNamed,
		IDebugPrintable {
	setParent(parnet: INode): void
	readonly parent: INode | null
}

/**
 * This is an `INode<[INode[]]>` with chidlren, that can be
 * "broken down" in its JSON-serialization. It allows to represent a
 * node as various "start-end" pairs of strings, two of which include
 * its children's serializations [`.jsonInsertablePre()` and `.jsonInsertablePost()`],
 * and another [`.jsonInsertableEmpty()`] doesn't.
 */
export interface IRecursiveNode extends IPoolNode<[INode[]]> {
	jsonInsertablePre(): [string, string]
	jsonInsertableEmpty(): [string, string]
	jsonInsertablePost(): [string, string]
}

/**
 * This is a case of `IRecursiveNode`, which is also capable of
 * being used as a grow-only collection. Particularly useful for
 * tree-mapping.
 */
export type ICollectionNode = IRecursiveNode & IPushable<INode>

export interface ICarrierNode<V = any> extends INode, IValued<V> {}

/**
 * This is an `INode`, carrying data of type `V`
 */
export interface ICellNode<V = any> extends IPoolNode, ICarrierNode<V> {}

/**
 * This is an interface for representing a poolable `INode`.
 * It can be freed via the 'free()' method.
 */
export interface IPoolNode<Args extends any[] = any[]>
	extends INode,
		IInitializable<Args>,
		IFreeable {}

/**
 * This is a function for creation of `INode` from an `x: any`,
 * or returning `false`, when this is not possible.
 */
export type INodeMaker<K extends INode = INode> = (x: any) => K | false

/**
 * This is an interface for representing `INode` -factories without
 * their respective .type-information, but with deserialization capabilities.
 */
export interface INodeType<Args extends any[] = any[], K extends INode = INode>
	extends ITypeCheckable,
		ITyped,
		IDebugNamed {
	new (...args: Args): K
	fromPlain(x: any, maker: INodeMaker): K | false
}

/**
 * This is a type for representing the class of a
 * poolable node. It carries a `.pool` property for
 * accessing the pool, and making use of it.
 */
export interface IPoolNodeType<
	Args extends any[] = any[],
	K extends IPoolNode<Args> = IPoolNode<Args>
> extends INodeType<Partial<Args> | [], K> {
	readonly pool: ObjectPool
}

export interface ICarrierNodeType<
	V = any,
	C extends ICarrierNode<V> = ICarrierNode<V>
> extends INodeType<[V], C> {
	make(value: V): ICarrierNode
}

export interface ISingletonNodeType extends INodeType<[], INode> {
	make(): INode
}

/**
 * This interface is intended to represent instances of `INodeType< [V], ICellNode<V>>`
 * that carry data of type `V`.
 */
export interface ICellNodeType<V = any, K extends ICellNode<V> = ICellNode<V>>
	extends IPoolNodeType<[V], K> {}

/**
 * This is an interface for representing `INodeType< Args>` extensions
 * specifically purposed for `IRecursiveNode` instances.
 */
export interface IRecursiveNodeType<K extends IRecursiveNode = IRecursiveNode>
	extends IPoolNodeType<[INode[]?], K> {}

/**
 * This is a type specifically for representing `IRecursiveNodeType`s
 * that are intended to produce `ICollectionNode`s
 */
export type ICollectionNodeType<C extends ICollectionNode = ICollectionNode> =
	IRecursiveNodeType<C>

/**
 * This is an interface for representing a function-factory for `INodeType< Args>`
 * instances.
 */
export type INodeTypeFactory<
	Args extends any[] = any[],
	K extends INodeType<Args> = INodeType<Args>
> = (type: IValidNodeType, ...args: any[]) => K

/**
 * This is the interface for representing a function-factory for `ICellNodeType< V>`.
 */
export type ICellNodeTypeFactory<V = any> = INodeTypeFactory<
	[V],
	ICellNodeType<V>
>

/**
 * This is an interface for representing a function-factory for `IRecursiveNodeType< Args>`
 */
export type IRecursiveNodeTypeFactory<
	K extends IRecursiveNodeType = IRecursiveNodeType
> = (type: IValidNodeType) => K

/**
 * This is an interface for representing function-factory for `ICollectionNodeType< Args>`
 */
export type ICollectionNodeFactory =
	IRecursiveNodeTypeFactory<ICollectionNodeType>

/**
 * This is an interface for representing a mapping of an `INodeTypeFactory<T>`
 * to lists of `T[]`. Typically employed to simplify type-creation/maintenance.
 */
export type INodeTypeCategories<T = any> = [INodeTypeFactory, T[]][]
