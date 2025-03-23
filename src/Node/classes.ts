import type { IPointer } from "../interfaces.js"
import type { INode } from "./interfaces.js"

import { inplace, array } from "@hgargg-0710/one"

abstract class CommonTree<Type = any, Value = any>
	implements INode<Type, Value>
{
	readonly type: Type

	parent: INode<Type> | null = null

	get lastChild() {
		return -1
	}

	abstract write(node: INode<Type>, multindex: readonly number[]): this
	abstract insert(node: INode<Type>, index?: number): this
	abstract index(multindex: readonly number[]): INode<Type>
	abstract remove(index?: number): this
	abstract read(index: number): INode<Type>

	abstract copy(): INode<Type, Value>
	abstract set(node: INode<Type, Value>, i: number): this

	backtrack(positions: number) {
		let curr: INode<Type, Value> = this
		while (--positions) curr = curr.parent!
		return curr
	}

	findUnwalkedChildren(endInd: number[]) {
		let result = array.lastIndex(endInd)
		let currTree: INode<Type, Value> = this
		while (
			(currTree = currTree.parent!) &&
			currTree.lastChild <= endInd[result]
		)
			--result
		return result
	}
}

abstract class PreTokenNode<Type = any> extends CommonTree<Type> {
	type: Type;

	["constructor"]: new () => typeof this

	// * Dummy methods [interface conformance]
	set(node: INode<Type>, i: number) {
		return this
	}

	write(node: INode<Type>, multindex: number[]) {
		return this
	}

	insert() {
		return this
	}

	index(multind: number[]): any {}

	remove() {
		return this
	}

	read(i: number): INode<Type> {
		return this
	}

	copy() {
		return new this.constructor()
	}
}

export function TokenNode<Type = any>(type: Type): new () => INode<Type> {
	class tokenNode extends PreTokenNode<Type> implements INode<Type> {
		static readonly type = type
	}
	tokenNode.prototype.type = type
	return tokenNode
}

abstract class PreContentNode<Type = any, Value = any>
	extends PreTokenNode<Type>
	implements IPointer<Value>
{
	["constructor"]: new (value?: Value) => typeof this

	copy() {
		return new this.constructor(this.value)
	}

	constructor(public value: Value) {
		super()
	}
}

export function ContentNode<Type = any, Value = any>(
	type: Type
): new (value: Value) => INode<Type, Value> {
	class contentNode extends PreContentNode<Type, Value> {
		static readonly type = type
	}
	contentNode.prototype.type = type
	return contentNode
}

abstract class PreRecursiveNode<Type = any, Value = any>
	extends PreTokenNode<Type>
	implements INode<Type, Value> {}

export function RecursiveNode<Type = any, Value = any>(
	type: Type
): new (children?: INode<Type, Value>[]) => INode<Type, Value> {
	class recursiveNode extends PreRecursiveNode<Type, Value> {
		["constructor"]: new (children?: INode<Type, Value>[]) => typeof this

		read(i: number): INode<Type, Value> {
			return this.children[i]
		}

		set(node: INode<Type, Value>, i: number): this {
			this.children[i] = node
			return this
		}

		get lastChild() {
			return this.children.length - 1
		}

		index(multindex: number[]): INode<Type, Value> {
			let result: INode<Type, Value> = this
			for (let i = 0; i < multindex.length; ++i)
				result = result.read(multindex[i])
			return result
		}

		write(node: INode<Type, Value>, multindex: number[]) {
			let writtenTo: INode<Type, Value> = this
			for (let i = 0; i < multindex.length - 1; ++i)
				writtenTo = writtenTo.read(multindex[i])
			writtenTo.set(node, array.last(multindex))
			return this
		}

		copy() {
			return new this.constructor(this.children.map((x) => x.copy()))
		}

		insert(
			node?: INode<Type, Value>,
			index: number = this.children.length - 1
		) {
			inplace.insert(this.children, index, node)
			return this
		}

		remove(index: number = this.children.length - 1): this {
			this.children[index].parent = null
			inplace.out(this.children, index)
			return this
		}

		constructor(protected children: INode<Type, Value>[] = []) {
			super()
			for (const child of children) child.parent = this
		}
	}

	recursiveNode.prototype.type = type

	return recursiveNode
}
