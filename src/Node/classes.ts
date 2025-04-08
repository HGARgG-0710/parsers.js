import type { IPointer } from "../interfaces.js"
import type { INode, INodeClass } from "./interfaces.js"

import { inplace, array } from "@hgargg-0710/one"
import { isType } from "./utils.js"
import { BasicHash } from "../HashMap/classes.js"
import { MapInternal } from "../HashMap/InternalHash/classes.js"
import { Autocache } from "../internal/Autocache.js"

abstract class PreTokenNode<Type = any, Value = any>
	implements INode<Type, Value>
{
	["constructor"]: new () => typeof this

	type: Type
	parent: INode<Type> | null = null

	get lastChild() {
		return -1
	}

	backtrack(positions: number) {
		let curr: INode<Type, Value> = this
		while (--positions) curr = curr.parent!
		return curr
	}

	findUnwalkedChildren(endInd: number[]) {
		let currTree: INode<Type, Value> = this
		let result = array.lastIndex(endInd)
		while (
			(currTree = currTree.parent!) &&
			currTree.lastChild <= endInd[result]
		)
			--result
		return result
	}

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

export const TokenNode = new Autocache(
	new BasicHash(new MapInternal()),
	function <Type = any>(type: Type) {
		class tokenNode extends PreTokenNode<Type> implements INode<Type> {
			static readonly type = type
			static is = isType(type)
		}
		tokenNode.prototype.type = type
		return tokenNode
	}
) as unknown as <Type = any, Value = any>(type: Type) => INodeClass<Type, Value>

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

export const ContentNode = new Autocache(
	new BasicHash(new MapInternal()),
	function <Type = any, Value = any>(type: Type) {
		class contentNode extends PreContentNode<Type, Value> {
			static readonly type = type
			static is = isType(type)
		}
		contentNode.prototype.type = type
		return contentNode
	}
) as unknown as <Type = any, Value = any>(type: Type) => INodeClass<Type, Value>

abstract class PreRecursiveNode<Type = any, Value = any>
	extends PreTokenNode<Type>
	implements INode<Type, Value>
{
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

export const RecursiveNode = new Autocache(
	new BasicHash(new MapInternal()),
	function <Type = any, Value = any>(type: Type) {
		class recursiveNode extends PreRecursiveNode<Type, Value> {
			static readonly type = type
			static is = isType(type)
		}
		recursiveNode.prototype.type = type
		return recursiveNode
	}
) as unknown as <Type = any, Value = any>(type: Type) => INodeClass<Type, Value>
