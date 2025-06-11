import { array, functional } from "@hgargg-0710/one"
import type { IFreeable, IPoolGetter } from "../interfaces.js"
import type {
	ICellNode,
	INode,
	INodeClass,
	INodeMaker,
	IRecursiveNode,
	ITyped
} from "../interfaces/Node.js"
import { isCopiable } from "../is.js"
import {
	isContentNodeSerializable,
	isRecursiveNodeSerializable,
	isTyped
} from "../is/Node.js"
import { isType } from "../utils/Node.js"
import { NodeFactory, RecursiveNodeFactory } from "./NodeSystem.js"

const { id } = functional

/**
 * An abstract class implementing the `INode<T>` type.
 * Recommended way to create `INode<T>` implementations.
 *
 * Provides:
 *
 * 1. required `readonly type: T`
 * 2. various boilerplate methods
 * 3. default behaviour for the future classes [.free, .backtrack]
 * 4. guarantee of (otherwise optional) `IFreeable<T>` conformance
 */
export abstract class BaseNode<T = any, Args extends any[] = any[]>
	implements INode<T>, IFreeable<T>
{
	abstract readonly type: T

	abstract init(...x: [] | Partial<Args>): this
	abstract copy(): this

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

	free(poolGetter: IPoolGetter<T>) {
		poolGetter.get(this.type)!.free(this)
	}
}

abstract class PreTokenNode<T = any>
	extends BaseNode<T, []>
	implements INode<T>
{
	protected ["constructor"]: new () => this

	static fromPlain<T = any>(
		this: INodeClass<T, []>,
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
export const TokenNode = NodeFactory(function <T = any>(type: T) {
	const jsonObject = { type }
	class tokenNode extends PreTokenNode<T> implements INode<T> {
		static readonly type = type
		static is = isType(type)

		toJSON() {
			return jsonObject
		}

		get type() {
			return type
		}
	}
	return tokenNode
})

abstract class PreContentNode<T = any, Value = any>
	extends BaseNode<T, [Value]>
	implements ICellNode<T, Value>
{
	protected ["constructor"]: new (value?: Value) => this

	static fromPlain<T = any, Value = any>(
		this: INodeClass<T, [Value]>,
		x: any,
		nodeMaker: INodeMaker<T>
	) {
		if (!isContentNodeSerializable(x)) return false
		return new this(x.value)
	}

	private _value: Value | undefined

	private setValue(newValue: Value | undefined) {
		this._value = newValue
	}

	get value() {
		return this._value!
	}

	copy() {
		return new this.constructor(
			isCopiable(this.value) ? this.value.copy() : this.value
		)
	}

	init(value?: Value | undefined) {
		this.setValue(value)
		return this
	}

	constructor(value?: Value) {
		super()
		this.init(value)
	}
}

/**
 * This is an `INodeTypeFactory<T, [Value | undefined]>` for creation of `INode`
 * instances with `.type` field (on prototype; defined by `type: T`)
 * and `.value: Value`, which is provided by the user within the
 * resulting class's constructor.
 *
 * Note: the instances of `INodeType<T, [Value | undefined]>`s
 * returned by `ContentNode` are poolable using the `ObjectPool`
 */
export const ContentNode = NodeFactory(function <T = any, Value = any>(
	type: T
) {
	class contentNode extends PreContentNode<T, Value> {
		static readonly type = type
		static is = isType(type)

		toJSON() {
			return {
				type,
				value: this.value
			}
		}

		get type() {
			return type
		}
	}
	return contentNode
})

abstract class PreRecursiveNode<T = any>
	extends BaseNode<T>
	implements IRecursiveNode<T>
{
	protected ["constructor"]: new (children?: INode<T>[]) => this

	static fromPlain<T = any>(
		this: INodeClass<T, [INode<T>[]]>,
		x: any,
		nodeMaker: INodeMaker<T>
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

	set(node: INode<T>, i: number): this {
		this.children[i] = node
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
		return new this.constructor(this.children.map((x) => x.copy()))
	}

	init(children: INode<T>[] = []) {
		this.setChildren(children)
		this.assignSelfParent()
		return this
	}

	free(poolGetter: IPoolGetter<T>): void {
		for (const child of this.children) child.free?.(poolGetter)
		super.free(poolGetter)
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
 * This is an `IRecursiveNodeFactory<T, [INode<T>[] | undefined]` for
 * creation of `IRecursiveNode`s with `.type: T` properties,
 * to which the give-value of `type: T` is given [prototype property],
 * as well as a variety of methods for working with `children: INode<T>[]`,
 * which are specified on construction [upon omission, empty array is assumed].
 *
 * It also has other common `IRecursiveNodeFactory` methods, such as those
 * for providing "wrapping" JSON for separate serialization of internal
 * items [`.jsonInsertablePre(): string`, `.jsonInsertablePost(): string`,
 * `.jsonInsertableEmpty(): string`]
 *
 * Note: The resulting `IRecursiveNodeType<T, [INode<T>[] | undefined]` create
 * `IRecursiveNode<T, [INode<T>[] | undefined]` that are poolable via `ObjectPool`
 */
export const RecursiveNode = RecursiveNodeFactory(function <T = any>(type: T) {
	class recursiveNode extends PreRecursiveNode<T> {
		static readonly type = type
		static is = isType(type)

		get type() {
			return type
		}
	}
	return recursiveNode
})
