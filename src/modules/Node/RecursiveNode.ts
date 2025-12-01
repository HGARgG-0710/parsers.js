import { functional } from "@hgargg-0710/one"
import assert from "assert"
import type {
	ICollectionNode,
	ICollectionNodeType,
	INode,
	INodeMaker,
	IValidatable,
	IValidationTable,
	IXMLGenerationTable
} from "../../interfaces.js"
import {
	closingTag,
	isIdentifier,
	printValidAttrs,
	tabbed,
	toXML
} from "../../samples/xml.js"
import { isFreeable, tryCopy } from "../../utils.js"
import { isRecursiveNodeSerializable } from "../../utils/Node.js"
import { PreNodeFactory } from "./before/PreNodeFactory.js"
import { NodeFactory } from "./NodeFactory.js"
import { PoolableNode } from "./PoolableNode.js"

const { id } = functional

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
		for (const child of this.children) child.setParent(this)
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

	toXML(table: IXMLGenerationTable): string[] {
		const { type } = this
		assert(isIdentifier(type))
		const openTag = `<${type} ${this.children
			.map((c) => {
				const asAttr = table.toAttr(this.type, c.type)
				return asAttr ? printValidAttrs(asAttr(c)) : ""
			})
			.join(" ")}/>`
		const childTags = this.children
			.map((c) => (table.isTag(type, c.type, c) ? toXML(c, table) : []))
			.flat()
		const closeTag = closingTag(type)
		return [openTag, ...tabbed(childTags), closeTag]
	}

	validate(table: IValidationTable<INode>): boolean {
		return this.children.every((child) =>
			table.validate(this.type, child.type, child)
		)
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
	PreNodeFactory<ICollectionNodeType<ICollectionNode & IValidatable<INode>>>(
		PreRecursiveNode
	)
)
