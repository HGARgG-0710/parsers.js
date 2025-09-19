import { array, functional } from "@hgargg-0710/one"
import type { IFreeable } from "../interfaces.js"
import type {
	ICellNode,
	ICellNodeType,
	ICollectionNode,
	ICollectionNodeType,
	INode,
	INodeMaker,
	INodeType,
	IPoolNodeType,
	ITyped
} from "../interfaces/Node.js"
import { isFreeable } from "../is.js"
import {
	isContentNodeSerializable,
	isRecursiveNodeSerializable,
	isTyped
} from "../is/Node.js"
import { tryCopy } from "../utils.js"
import { isType } from "../utils/Node.js"
import { NodeFactory } from "./NodeSystem.js"
import { ObjectPool } from "./ObjectPool.js"

const { id } = functional

/**
 * An abstract class implementing the `INode<T>` type.
 * Recommended way to create `INode<T>` implementations.
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
export abstract class BaseNode<T = any, Args extends any[] = any[]>
	implements INode<T>
{
	abstract readonly type: T
	abstract init(...x: [] | Partial<Args>): this
	toJSON?(): ITyped<T>

	parent: INode<T> | null = null

	index(multind: number[]): INode<T> {
		return this
	}

	backtrack(positions: number) {
		let curr: INode<T> = this
		while (--positions) curr = curr.parent!
		return curr
	}

	findUnwalkedChildren(endInd: number[]) {
		let currTree: INode<T> = this
		let result = array.lastIndex(endInd)
		while (
			(currTree = currTree.parent!) &&
			currTree.lastChild <= endInd[result]
		)
			--result
		return result
	}

	read(i: number): INode<T> {
		return this
	}

	get lastChild() {
		return -1
	}
}

/**
 * This is a class that encapsulates the pooling logic for
 * `BaseNode<T, Args>` descendants. It is strongly recommended
 * for use as a parent whenever needing the pooling functionality
 * for the library's `INode` interface.
 *
 * The 'protected abstract readonly pool: ObjectPool' property
 * is intended to be overriden by the child classes, and to
 * contain the pool which would do the creation and the freeing
 * of the `INode<T, Args>` instances.
 */
export abstract class PoolableNode<T = any, Args extends any[] = any[]>
	extends BaseNode<T, Args>
	implements IFreeable
{
	protected abstract readonly pool: ObjectPool

	free() {
		this.pool.free(this)
	}
}

abstract class PreTokenNode<T = any>
	extends PoolableNode<T, []>
	implements INode<T>
{
	protected ["constructor"]: new () => this

	static fromPlain<T = any>(
		this: IPoolNodeType<T, []>,
		x: any,
		nodeMaker: INodeMaker<T>
	) {
		if (!isTyped(x)) return false
		return new this()
	}

	copy() {
		return new this.constructor()
	}

	init() {
		return this
	}
}

/**
 * This is an `INodeTypeFactory<T, []>` for creation of simplest possible
 * `INode` instances. They contain no data, and have minimal memory
 * footprint. Their only useful property is `.type`, which is
 * added to the prototype of the respective `INodeType<T, []>`,
 * and has the value of `type: T`.
 *
 * Note: the `INode<T>` instances of `INodeType<T, []>`s created
 * using `TokenNode` are poolable via `ObjectPool`
 */
export const TokenNode = NodeFactory(function <T = any>(
	type: T
): IPoolNodeType<T, []> {
	const jsonObject = { type }
	class tokenNode extends PreTokenNode<T> implements INode<T> {
		static readonly type = type
		static readonly is = isType(type)
		static readonly pool = new ObjectPool(tokenNode)

		toJSON() {
			return jsonObject
		}

		protected get pool() {
			return tokenNode.pool
		}

		get type() {
			return type
		}
	}

	return tokenNode
})

abstract class SingleItemNode<T = any, Value = any> extends PoolableNode<
	T,
	[Value]
> {
	protected ["constructor"]: new (value?: Value) => this

	static fromPlain<T = any, Value = any>(
		this: ICellNodeType<T, Value>,
		x: any,
		nodeMaker: INodeMaker<T, ICellNode<T, Value>>
	) {
		if (!isContentNodeSerializable(x)) return false
		return new this(x.value)
	}
}

abstract class PreContentNode<T = any, Value = any>
	extends SingleItemNode<T, Value>
	implements ICellNode<T, Value>
{
	private _value: Value | undefined

	private setValue(newValue: Value | undefined) {
		this._value = newValue
	}

	get value() {
		return this._value!
	}

	copy() {
		return new this.constructor(tryCopy(this.value))
	}

	init(value?: Value | undefined) {
		this.setValue(value)
		return this
	}

	toJSON() {
		return {
			type: this.type,
			value: this.value
		}
	}

	constructor(value?: Value) {
		super()
		this.init(value)
	}
}

abstract class PreSingleChildNode<T = any> extends SingleItemNode<T, INode<T>> {
	private child?: INode<T>

	copy(): this {
		return this.child
			? new this.constructor(tryCopy(this.child))
			: new this.constructor()
	}

	init(newChild?: INode<T>): this {
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
}

/**
 * This is an `INodeTypeFactory<T, [Value | undefined]>` for creation of
 * `INode` instances with `.type` field (on prototype) defined by `type: T`
 * and a single child-node, which is reflected in tree-iteration algorithms.
 * In cases when a child is guaranteed to be the same preferable over
 * `RecursiveNode`.
 */
export const SingleChildNode = NodeFactory(function <T = any>(
	type: T
): INodeType<T, [INode<T>]> {
	class singleChildNode extends PreSingleChildNode<T> {
		static readonly type = type
		static readonly is = isType(type)
		static readonly pool = new ObjectPool(singleChildNode)

		protected get pool() {
			return singleChildNode.pool
		}

		get type() {
			return type
		}
	}

	return singleChildNode
})

/**
 * This is an `INodeTypeFactory<T, [Value | undefined]>` for creation of `INode`
 * instances with `.type` field (on prototype) defined by `type: T`
 * and `.value: Value`, which is provided by the user within the
 * resulting class's constructor.
 *
 * Note: the instances of `INodeType<T, [Value | undefined]>`s
 * returned by `ContentNode` are poolable using the `ObjectPool`
 */
export const ContentNode = NodeFactory(function <T = any, Value = any>(
	type: T
): ICellNodeType<T, Value> {
	class contentNode extends PreContentNode<T, Value> {
		static readonly type = type
		static readonly is = isType(type)
		static readonly pool = new ObjectPool(contentNode)

		protected get pool() {
			return contentNode.pool
		}

		get type() {
			return type
		}
	}

	return contentNode
})

abstract class PreRecursiveNode<T = any>
	extends PoolableNode<T, [INode<T>[]]>
	implements ICollectionNode<T>
{
	protected ["constructor"]: new (children?: INode<T>[]) => this

	static fromPlain<T = any>(
		this: ICollectionNodeType<T>,
		x: any,
		nodeMaker: INodeMaker<T, ICollectionNode<T>>
	) {
		if (!isRecursiveNodeSerializable(x)) return false
		const maybeNodes = x.children.map(nodeMaker)
		return maybeNodes.every(id) && new this(maybeNodes as INode<T>[])
	}

	private children: INode<T>[]

	private setChildren(children: INode<T>[]) {
		this.children = children
	}

	private assignSelfParent() {
		for (const child of this.children) child.parent = this
	}

	read(i: number): INode<T> {
		return this.children[i]
	}

	push(...children: INode<T>[]) {
		this.children.push(...children)
		return this
	}

	get lastChild() {
		return this.children.length - 1
	}

	index(multindex: number[]): INode<T> {
		let result: INode<T> = this
		for (let i = 0; i < multindex.length; ++i)
			result = result.read(multindex[i])
		return result
	}

	copy() {
		return new this.constructor(this.children.map(tryCopy))
	}

	init(children: INode<T>[] = []) {
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

	constructor(children?: INode<T>[]) {
		super()
		this.init(children)
	}
}

/**
 * This is an `<T = any> (type: T) => IRecursiveNodeType<T, [INode<T>?, ICollectionNode<T>]>` for
 * creation of `ICollectionNode`s with `.type: T` properties,
 * to which the give-value of `type: T` is given [prototype property],
 * as well as a variety of methods for working with `children: INode<T>[]`,
 * which are specified on construction [upon omission, empty array is assumed].
 *
 * It also has other common `IRecursiveNodeTypeFactory` methods, such as those
 * for providing "wrapping" JSON for separate serialization of internal
 * items [`.jsonInsertablePre(): string`, `.jsonInsertablePost(): string`,
 * `.jsonInsertableEmpty(): string`]
 *
 * Note: The resulting `IRecursiveNodeType<T, [INode<T>[] | undefined]` create
 * `IRecursiveNode<T, [INode<T>[] | undefined]` that are poolable via `ObjectPool`
 */
export const RecursiveNode = NodeFactory(function <T = any>(
	type: T
): ICollectionNodeType<T> {
	class recursiveNode extends PreRecursiveNode<T> {
		static readonly type = type
		static readonly is = isType(type)
		static readonly pool = new ObjectPool(recursiveNode)

		protected get pool() {
			return recursiveNode.pool
		}

		get type() {
			return type
		}
	}
	return recursiveNode
})
