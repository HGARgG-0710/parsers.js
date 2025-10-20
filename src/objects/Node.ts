import { array, functional } from "@hgargg-0710/one"
import { isFreeable } from "src/utils.js"
import {
	isContentNodeSerializable,
	isRecursiveNodeSerializable,
	isTyped
} from "src/utils/Node.js"
import * as Pools from "../global/Pools.js"
import type { IFreeable } from "../interfaces.js"
import type {
	ICarrierNode,
	ICarrierNodeType,
	ICellNode,
	ICellNodeType,
	ICollectionNode,
	ICollectionNodeType,
	INode,
	INodeMaker,
	INodeType,
	IPoolNodeType,
	ITyped,
	IValidNodeType
} from "../interfaces/Node.js"
import { tryCopy } from "../utils.js"
import { isType } from "../utils/Node.js"
import { NodeFactory } from "./NodeSystem.js"
import { ObjectPool } from "./ObjectPool.js"

const { id } = functional

/**
 * An abstract class implementing the `INode` type.
 * Recommended way to create `INode` implementations.
 *
 * Provides:
 *
 * 1. required `readonly type: T`
 * 2. various boilerplate methods
 * 3. default behaviour for the future classes:
 * 	1. .backtrack method
 *  	2. .findUnwalkedChildren
 *  	3. .lastChild == -I
 */
export abstract class BaseNode implements INode {
	abstract readonly type: IValidNodeType
	abstract readonly debugName: string
	abstract debugPrint(): string

	toJSON?(): ITyped

	parent: INode | null = null

	index(multind: number[]) {
		if (this.lastChild < 0) return this
		const [firstIndex, ...subIndex] = multind
		return this.read(firstIndex).index(subIndex)
	}

	backtrack(positions: number) {
		let curr: INode = this
		while (--positions) curr = curr.parent!
		return curr
	}

	findUnwalkedChildren(endInd: number[]) {
		let currTree: INode = this
		let result = array.lastIndex(endInd)
		while (
			(currTree = currTree.parent!) &&
			currTree.lastChild <= endInd[result]
		)
			--result
		return result
	}

	read(i: number): INode {
		return this
	}

	get lastChild() {
		return -1
	}
}

/**
 * This is a class that encapsulates the pooling logic for
 * `BaseNode<Args>` descendants. It is strongly recommended
 * for use as a parent whenever needing the pooling functionality
 * for the library's `INode` interface.
 *
 * The 'protected abstract readonly pool: ObjectPool' property
 * is intended to be overriden by the child classes, and to
 * contain the pool which would do the creation and the freeing
 * of the `INode<Args>` instances.
 */
export abstract class PoolableNode<Args extends any[] = any[]>
	extends BaseNode
	implements IFreeable
{
	abstract init(...x: [] | Partial<Args>): this
	protected abstract readonly pool: ObjectPool

	free() {
		this.pool.free(this)
	}
}

abstract class PreTokenNode extends PoolableNode<[]> implements INode {
	protected ["constructor"]: new () => this

	static fromPlain(this: IPoolNodeType<[]>, x: any, nodeMaker: INodeMaker) {
		if (!isTyped(x)) return false
		return new this()
	}

	copy() {
		return new this.constructor()
	}

	init() {
		return this
	}

	toJSON(): ITyped {
		return { type: this.type }
	}

	debugPrint(): string {
		return `${this.debugName}`
	}
}

const makeTokenNodeFactory = PreNodeFactory<IPoolNodeType<[]>>(PreTokenNode)

export const CachedTokenNode = NodeFactory(function (
	type: IValidNodeType,
	debugName: string
) {
	const factory = makeTokenNodeFactory(type, debugName)
	const cachedInstance = new factory()
	return class extends factory {
		static make() {
			return cachedInstance
		}

		constructor() {
			throw new TypeError(
				"cannot call constructor of a `CachedTokenNode` - use `.make()` method instead"
			)
			super()
		}
	}
})

/**
 * This is an `INodeTypeFactory<T, []>` for creation of simplest possible
 * `INode` instances. They contain no data, and have minimal memory
 * footprint. Their only useful property is `.type`, which is
 * added to the prototype of the respective `INodeType< []>`,
 * and has the value of `type: T`.
 *
 * Note: the `INode` instances of `INodeType< []>`s created
 * using `TokenNode` are poolable via `ObjectPool`
 */
export const TokenNode = NodeFactory(makeTokenNodeFactory)

abstract class SingleItemNode<Value = any> extends PoolableNode<[Value]> {
	protected ["constructor"]: new (value?: Value) => this

	static fromPlain<Value = any>(
		this: ICellNodeType<Value>,
		x: any,
		nodeMaker: INodeMaker<ICellNode<Value>>
	) {
		if (!isContentNodeSerializable(x)) return false
		return new this(x.value)
	}
}

abstract class MaybeContainingNode<Value = any>
	extends SingleItemNode<Value>
	implements ICarrierNode<Value>
{
	private _value: Value | undefined

	protected setValue(newValue: Value | undefined) {
		this._value = newValue
	}

	get value() {
		return this._value!
	}

	copy() {
		return new this.constructor(tryCopy(this.value))
	}

	toJSON() {
		return {
			type: this.type,
			value: this.value
		}
	}

	debugPrint(): string {
		return `${this.debugName} { value: ${this.value} }`
	}

	constructor(value?: Value) {
		super()
		this.setValue(value)
	}
}

abstract class AlwaysContainingNode<
	Value = any
> extends MaybeContainingNode<Value> {
	constructor(value: Value) {
		super(value)
	}
}

const makeCachedContentNodeFactory =
	PreNodeFactory<ICarrierNodeType>(AlwaysContainingNode)

export const CachedContentNode = NodeFactory(function <V = any>(
	type: IValidNodeType,
	debugName: string
): ICarrierNodeType<V> {
	const factory = makeCachedContentNodeFactory(type, debugName)
	const instanceMap = new Map<V, ICarrierNode>()

	function getCachedInstance(value: V) {
		return instanceMap.get(value)
	}

	function cacheNewInstance(value: V) {
		const newInstance = new factory(value)
		instanceMap.set(value, newInstance)
		return newInstance
	}

	return class extends factory {
		static make(value: V) {
			return getCachedInstance(value) || cacheNewInstance(value)
		}

		constructor(value: V) {
			throw new TypeError(
				"Cannot create a `CachedContentNode` instance via `new` call, use the static `make` method instead"
			)
			super(value)
		}
	}
})

abstract class PreContentNode<Value = any>
	extends MaybeContainingNode<Value>
	implements ICellNode<Value>
{
	init(value?: Value | undefined) {
		this.setValue(value)
		return this
	}
}

abstract class PreSingleChildNode extends SingleItemNode<INode> {
	private child?: INode

	copy(): this {
		return this.child
			? new this.constructor(tryCopy(this.child))
			: new this.constructor()
	}

	init(newChild?: INode): this {
		this.child = newChild
		return this
	}

	get lastChild() {
		return this.child ? 0 : -1
	}

	toJSON() {
		return {
			type: this.type,
			child: this.child
		}
	}

	debugPrint(): string {
		return `${this.debugName}${
			this.child ? ` { child: ${this.child.debugPrint()} }` : ""
		}`
	}
}

/**
 * This is an `INodeTypeFactory<T, [Value | undefined]>` for creation of
 * `INode` instances with `.type` field (on prototype) defined by `type: T`
 * and a single child-node, which is reflected in tree-iteration algorithms.
 * In cases when a child is guaranteed to be the same preferable over
 * `RecursiveNode`.
 */
export const SingleChildNode = NodeFactory(
	PreNodeFactory<IPoolNodeType<[INode]>>(PreSingleChildNode)
)

const makeContentNodeFactory = PreNodeFactory<ICellNodeType>(PreContentNode)

/**
 * This is an `INodeTypeFactory<T, [Value | undefined]>` for creation of `INode`
 * instances with `.type` field (on prototype) defined by `type: T`
 * and `.value: Value`, which is provided by the user within the
 * resulting class's constructor.
 *
 * Note: the instances of `INodeType< [Value | undefined]>`s
 * returned by `ContentNode` are poolable using the `ObjectPool`
 */
export const ContentNode = NodeFactory(function <Value = any>(
	type: IValidNodeType,
	debugName: string
): ICellNodeType<Value> {
	return makeContentNodeFactory(type, debugName)
})

abstract class PreRecursiveNode
	extends PoolableNode<[INode[]]>
	implements ICollectionNode
{
	protected ["constructor"]: new (children?: INode[]) => this

	static fromPlain(
		this: ICollectionNodeType,
		x: any,
		nodeMaker: INodeMaker<ICollectionNode>
	) {
		if (!isRecursiveNodeSerializable(x)) return false
		const maybeNodes = x.children.map(nodeMaker)
		return maybeNodes.every(id) && new this(maybeNodes as INode[])
	}

	private children: INode[]

	private setChildren(children: INode[]) {
		this.children = children
	}

	private assignSelfParent() {
		for (const child of this.children) child.parent = this
	}

	read(i: number): INode {
		return this.children[i]
	}

	push(...children: INode[]) {
		this.children.push(...children)
		return this
	}

	get lastChild() {
		return this.children.length - 1
	}

	index(multindex: number[]): INode {
		let result: INode = this
		for (let i = 0; i < multindex.length; ++i)
			result = result.read(multindex[i])
		return result
	}

	copy() {
		return new this.constructor(this.children.map(tryCopy))
	}

	init(children: INode[] = []) {
		this.setChildren(children)
		this.assignSelfParent()
		return this
	}

	free(): void {
		for (const child of this.children) if (isFreeable(child)) child.free()
		super.free()
	}

	jsonInsertablePre(): [string, string] {
		return [
			`{"type": ${JSON.stringify(this.type)}, "children": [`,
			`${this.children.map((x) => JSON.stringify(x)).join(",")}]}`
		]
	}

	jsonInsertablePost(): [string, string] {
		return [
			`{"type": ${JSON.stringify(this.type)}, "children": [${this.children
				.map((x) => JSON.stringify(x))
				.join(",")}`,
			`]}`
		]
	}

	jsonInsertableEmpty(): [string, string] {
		return [`{"type": ${JSON.stringify(this.type)}, "children": [`, "]}"]
	}

	toJSON() {
		return {
			type: this.type,
			children: this.children
		}
	}

	debugPrint(): string {
		return `${this.debugName} { children: [ ${this.children
			.map((x) => x.debugPrint())
			.join(", ")} ] }`
	}

	constructor(children: INode[] = []) {
		super()
		this.init(children)
	}
}

/**
 * This is an `<T = any> (type: T) => IRecursiveNodeType< [INode?, ICollectionNode]>` for
 * creation of `ICollectionNode`s with `.type: T` properties,
 * to which the give-value of `type: T` is given [prototype property],
 * as well as a variety of methods for working with `children: INode[]`,
 * which are specified on construction [upon omission, empty array is assumed].
 *
 * It also has other common `IRecursiveNodeTypeFactory` methods, such as those
 * for providing "wrapping" JSON for separate serialization of internal
 * items [`.jsonInsertablePre(): string`, `.jsonInsertablePost(): string`,
 * `.jsonInsertableEmpty(): string`]
 *
 * Note: The resulting `IRecursiveNodeType< [INode[] | undefined]` create
 * `IRecursiveNode<[INode[] | undefined]` that are poolable via `ObjectPool`
 */
export const RecursiveNode = NodeFactory(
	PreNodeFactory<ICollectionNodeType>(PreRecursiveNode)
)

// Fuck you, TypeScript.
// I fucking hate you, you dumb piece of shit.
// It lacks support for passing Generic Expressions (lazily-evaluated generics...)
// If it had it, there wouldn't be a fucking need for doing... this
function PreNodeFactory<K extends INodeType = INodeType>(preNode: any) {
	return function (type: IValidNodeType, debugName: string): K {
		class concreteNode extends preNode {
			static readonly type = type
			static readonly is = isType(type)
			static readonly pool = Pools.Node.add(
				new ObjectPool(concreteNode as any)
			)
			static readonly debugName = debugName

			protected get pool() {
				return concreteNode.pool
			}

			get type() {
				return type
			}

			get debugName() {
				return concreteNode.debugName
			}
		}

		return concreteNode as unknown as K
	}
}
