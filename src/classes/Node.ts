import { array, inplace } from "@hgargg-0710/one"
import { MapInternal } from "../HashMap/InternalHash/classes/MapInternal.js"
import type {
	ICellClass,
	ICellNode,
	INode,
	INodeClass
} from "../interfaces/Node.js"
import { Autocache } from "../internal/Autocache.js"
import { isCopiable } from "../utils.js"
import { isType } from "../utils/Node.js"
import { BasicHash } from "./HashMap.js"

abstract class PreTokenNode<Type = any> implements INode<Type> {
	protected ["constructor"]: new () => this

	abstract type: Type
	parent: INode<Type> | null = null

	get lastChild() {
		return -1
	}

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

	toJSON(): string {
		return `{"type": ${JSON.stringify(this.type)}}`
	}
}

export const TokenNode = new Autocache(
	new BasicHash(new MapInternal()),
	function <Type = any>(type: Type) {
		class tokenNode extends PreTokenNode<Type> implements INode<Type> {
			static readonly type = type
			static is = isType(type)

			get type() {
				return type
			}
		}
		return tokenNode
	}
) as unknown as <Type = any>(type: Type) => INodeClass<Type>

abstract class PreContentNode<Type = any, Value = any>
	extends PreTokenNode<Type>
	implements ICellNode<Type, Value>
{
	protected ["constructor"]: new (value?: Value) => this

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

	constructor(public readonly value: Value) {
		super()
	}
}

export const ContentNode = new Autocache(
	new BasicHash(new MapInternal()),
	function <Type = any, Value = any>(type: Type) {
		class contentNode extends PreContentNode<Type, Value> {
			static readonly type = type
			static is = isType(type)

			get type() {
				return type
			}
		}
		return contentNode
	}
) as unknown as <Type = any, Value = any>(type: Type) => ICellClass<Type, Value>

abstract class PreRecursiveNode<Type = any>
	extends PreTokenNode<Type>
	implements INode<Type>
{
	protected ["constructor"]: new (children?: INode<Type>[]) => this

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

	write(node: INode<Type>, multindex: number[]) {
		this.index(array.lastOut(multindex)).set(node, array.last(multindex))
		return this
	}

	copy() {
		return new this.constructor(this.children.map((x) => x.copy()))
	}

	insert(node?: INode<Type>, index: number = this.children.length - 1) {
		inplace.insert(this.children, index, node)
		return this
	}

	remove(index: number = this.children.length - 1): this {
		this.children[index].parent = null
		inplace.out(this.children, index)
		return this
	}

	toJSON(): string {
		return `{"type": ${JSON.stringify(
			this.type
		)}, "children": ${JSON.stringify(this.children)}}`
	}

	constructor(protected children: INode<Type>[] = []) {
		super()
		for (const child of children) child.parent = this
	}
}

export const RecursiveNode = new Autocache(
	new BasicHash(new MapInternal()),
	function <Type = any>(type: Type) {
		class recursiveNode extends PreRecursiveNode<Type> {
			static readonly type = type
			static is = isType(type)

			get type() {
				return type
			}
		}
		return recursiveNode
	}
) as unknown as <Type = any>(type: Type) => INodeClass<Type>
