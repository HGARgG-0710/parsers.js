import { array, functional } from "@hgargg-0710/one"
import type { IPoolGetter } from "../interfaces.js"
import type {
	ICellNode,
	INode,
	INodeClass,
	INodeMaker,
	IRecursiveNode
} from "../interfaces/Node.js"
import { isCopiable } from "../is.js"
import {
	isContentNodeSerializable,
	isRecursiveNodeSerializable,
	isTyped
} from "../is/Node.js"
import { isType } from "../utils/Node.js"
import { NodeFactory } from "./NodeSystem.js"

const { id } = functional

export abstract class BaseNode<T = any, Args extends any[] = any[]>
	implements INode<T>
{
	abstract readonly type: T

	abstract init(...x: Args): this
	abstract toJSON(): string
	abstract copy(): this

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

	toJSON(): string {
		return `{"type": ${JSON.stringify(this.type)}}`
	}

	init() {
		return this
	}
}

export const TokenNode = NodeFactory(function <T = any>(type: T) {
	class tokenNode extends PreTokenNode<T> implements INode<T> {
		static readonly type = type
		static is = isType(type)

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

	toJSON(): string {
		return `{"type": ${JSON.stringify(
			this.type
		)}, "value": ${JSON.stringify(this.value)}}`
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

export const ContentNode = NodeFactory(function <T = any, Value = any>(
	type: T
) {
	class contentNode extends PreContentNode<T, Value> {
		static readonly type = type
		static is = isType(type)

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

	toJSON(): string {
		return `{"type": ${JSON.stringify(
			this.type
		)}, "children": ${JSON.stringify(this.children)}}`
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

	constructor(children?: INode<T>[]) {
		super()
		this.init(children)
	}
}

export const RecursiveNode = NodeFactory(function <T = any>(type: T) {
	class recursiveNode extends PreRecursiveNode<T> {
		static readonly type = type
		static is = isType(type)

		get type() {
			return type
		}
	}
	return recursiveNode
})
