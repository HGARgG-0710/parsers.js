import { array, functional } from "@hgargg-0710/one"
import { isCopiable } from "../is.js"
import {
	isContentNodeSerializable,
	isRecursiveNodeSerializable,
	isTyped
} from "../is/Node.js"
import type { IPoolGetter } from "../interfaces.js"
import type {
	ICellNode,
	INode,
	INodeClass,
	INodeMaker,
	IRecursiveNode
} from "../interfaces/Node.js"
import { isType } from "../utils/Node.js"
import { NodeFactory } from "./NodeSystem.js"

const { id } = functional

abstract class BaseNode<Type = any, Args extends any[] = any[]>
	implements INode<Type>
{
	abstract readonly type: Type

	abstract init(...x: Args): this
	abstract toJSON(): string
	abstract copy(): this

	parent: INode<Type> | null = null

	index(multind: number[]): any {}

	backtrack(positions: number) {
		let curr: INode<Type> = this
		while (--positions) curr = curr.parent!
		return curr
	}

	findUnwalkedChildren(endInd: number[]) {
		let currTree: INode<Type> = this
		let result = array.lastIndex(endInd)
		while (
			(currTree = currTree.parent!) &&
			currTree.lastChild <= endInd[result]
		)
			--result
		return result
	}

	read(i: number): INode<Type> {
		return this
	}

	get lastChild() {
		return -1
	}

	free(poolGetter: IPoolGetter<Type>) {
		poolGetter.get(this.type)!.free(this)
	}
}

abstract class PreTokenNode<Type = any>
	extends BaseNode<Type, []>
	implements INode<Type>
{
	protected ["constructor"]: new () => this

	static fromPlain<Type = any>(
		this: INodeClass<Type, []>,
		x: any,
		nodeMaker: INodeMaker<Type>
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

export const TokenNode = NodeFactory(function <Type = any>(type: Type) {
	class tokenNode extends PreTokenNode<Type> implements INode<Type> {
		static readonly type = type
		static is = isType(type)

		get type() {
			return type
		}
	}
	return tokenNode
})

abstract class PreContentNode<Type = any, Value = any>
	extends BaseNode<Type, [Value]>
	implements ICellNode<Type, Value>
{
	protected ["constructor"]: new (value?: Value) => this

	static fromPlain<Type = any, Value = any>(
		this: INodeClass<Type, [Value]>,
		x: any,
		nodeMaker: INodeMaker<Type>
	) {
		if (!isContentNodeSerializable(x)) return false
		return new this(x.value)
	}

	private _value: Value

	private set value(newValue: Value) {
		this._value = newValue
	}

	get value() {
		return this._value
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

	init(value?: Value) {
		if (value) this.value = value
		return this
	}

	constructor(value?: Value) {
		super()
		this.init(value)
	}
}

export const ContentNode = NodeFactory(function <Type = any, Value = any>(
	type: Type
) {
	class contentNode extends PreContentNode<Type, Value> {
		static readonly type = type
		static is = isType(type)

		get type() {
			return type
		}
	}
	return contentNode
})

abstract class PreRecursiveNode<Type = any>
	extends BaseNode<Type>
	implements IRecursiveNode<Type>
{
	protected ["constructor"]: new (children?: INode<Type>[]) => this

	static fromPlain<Type = any>(
		this: INodeClass<Type, [INode<Type>[]]>,
		x: any,
		nodeMaker: INodeMaker<Type>
	) {
		if (!isRecursiveNodeSerializable(x)) return false
		const maybeNodes = x.children.map(nodeMaker)
		return maybeNodes.every(id) && new this(maybeNodes as INode<Type>[])
	}

	private children: INode<Type>[]

	read(i: number): INode<Type> {
		return this.children[i]
	}

	set(node: INode<Type>, i: number): this {
		this.children[i] = node
		return this
	}

	get lastChild() {
		return this.children.length - 1
	}

	index(multindex: number[]): INode<Type> {
		let result: INode<Type> = this
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

	init(children?: INode<Type>[]) {
		if (children) this.children = children
		return this
	}

	free(poolGetter: IPoolGetter<Type>): void {
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

	constructor(children: INode<Type>[] = []) {
		super()
		this.init(children)
		for (const child of children) child.parent = this
	}
}

export const RecursiveNode = NodeFactory(function <Type = any>(type: Type) {
	class recursiveNode extends PreRecursiveNode<Type> {
		static readonly type = type
		static is = isType(type)

		get type() {
			return type
		}
	}
	return recursiveNode
})
