import { boolean, functional, type } from "@hgargg-0710/one"
import assert from "assert"
import { Config } from "../global.js"
import type {
	ICommonStream,
	INode,
	IOwnedStream,
	IValidationTable,
	IValidNodeType,
	IXMLAttributeGenerator,
	IXMLAttrTable,
	IXMLDebuggable,
	IXMLGenerationTable,
	IXMLOpenableNode,
	IXMLSimple,
	IXMLTagTable,
	IXMLVersion
} from "../interfaces.js"
import { XMLGenerationError } from "../objects/Error.js"
import {
	TreePairGenerationTable,
	TreeTable,
	TreeValidationTable
} from "../objects/Node.js"
import { FlattenerStream, HandlerStream } from "../objects/Stream.js"
import { curr } from "../utils/Stream.js"
import { DelimitedStream } from "./Stream.js"
import { regex } from "./regex.js"
import { toNewline } from "./space.js"

const { isString } = type
const { trivialCompose } = functional
const { F } = boolean

export function getTab() {
	return Config.xml.tab
}

export function tabbed(lines: string[]) {
	const tab = getTab()
	return lines.map((x) => `${tab}${x}`)
}

export function getAttrQuote() {
	return Config.xml.attrQuoteDouble ? '"' : "'"
}

export function getNewline() {
	return toNewline(Config.xml.lf)
}

export const XMLWrapper = DelimitedStream<string, IXMLOpenableNode>(
	() => `${getTab()}${getNewline()}`,
	(xmlNode) => {
		const [preLast, postFirst] = xmlNode.tag()
		return [
			[...xmlNode.pre(), preLast],
			[postFirst, ...xmlNode.post()]
		]
	}
)

export function XMLStream(table: IXMLGenerationTable) {
	const lineProducerStream = HandlerStream<IXMLDebuggable, string[]>(
		trivialCompose((source: IXMLDebuggable) => toXML(source, table), curr)
	)

	return (resource: IOwnedStream<IXMLDebuggable>): ICommonStream<string> =>
		FlattenerStream.pool.create(lineProducerStream(resource))
}

export function toXML(source: IXMLDebuggable, table: IXMLGenerationTable) {
	if (!source.toXML) throw new XMLGenerationError(source)
	return source.toXML(table)
}

export function toValidAttributes(
	attrs: [string, string][]
): [string, string][] {
	return attrs.map(([key, value]) => {
		assert(isIdentifier(key))
		return [key, toValidAttributeValue(value)]
	})
}

export function printAttrs(attrs: [string, string][]) {
	const quote = getAttrQuote()
	return attrs
		.map(([key, value]) => `${key}=${quote}${value}${quote}`)
		.join(" ")
}

export function printValidAttrs(attrs: [string, string][]) {
	return printAttrs(toValidAttributes(attrs))
}

export function toValidAttributeValue(value: string) {
	return value
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;")
		.replaceAll("\n", "&#xA")
		.replaceAll("\t", "&#x9")
		.replaceAll("\r", "&#xD")
		.replaceAll(">", "&gt;")
		.replaceAll("<", "&lt;")
		.replaceAll(" ", "&#x20")
}

export function toValidComment(comment: string) {
	return comment.replaceAll("--", "&#45;&#45;")
}

const nonNamespaceId = /[a-zA-Z_][0-9a-zA-Z-]*/

const fullNonNamespaceId = regex.assertions.begin(
	regex.assertions.end(nonNamespaceId)
)

const fullMaybeNamespaceId = regex.assertions.begin(
	regex.assertions.end(
		regex.and(
			nonNamespaceId,
			regex.quantifiers.maybe(regex.and(/:/, nonNamespaceId))
		)
	)
)

export function isProcessingInstructionTarget(id: string) {
	return fullNonNamespaceId.test(id)
}

export function isIdentifier(id: IValidNodeType): id is string {
	assert(isString(id))
	return fullMaybeNamespaceId.test(id)
}

export function toValidProcessingInstructionContent(content: string) {
	return content.replaceAll("?>", "?&gt;")
}

export function toValidTagContent(content: string) {
	return content.trim().replaceAll("<", "&lt;").replaceAll(">", "&gt;")
}

export class XMLProcessingInstructionNode implements IXMLSimple {
	private readonly content: string

	toXML(): string[] {
		return [`<?${this.target} ${this.content}?>`]
	}

	constructor(private readonly target: string, content: string) {
		assert(isProcessingInstructionTarget(target))
		this.content = toValidProcessingInstructionContent(content)
	}
}

export class XMLCommentNode implements IXMLSimple {
	private readonly comment: string

	toXML(): string[] {
		return [`<!--${this.comment}-->`]
	}

	constructor(comment: string) {
		this.comment = toValidComment(comment)
	}
}

export class XMLDeclarationNode implements IXMLSimple {
	toXML(): string[] {
		return [
			`<?xml version=${this.version} encoding=${
				this.encoding
			} standalone=${this.standalone ? "yes" : "no"}?>`
		]
	}

	constructor(
		private readonly version: IXMLVersion,
		private readonly encoding: string = "UTF-8",
		private readonly standalone: boolean = false
	) {}
}

class XMLOpenableNodeArgsBuilder {
	private tagName?: string
	private attrs?: [string, string][]
	private preTags: IXMLSimple[] = []
	private postTags: IXMLSimple[] = []

	setTagName(tagName: string) {
		this.tagName = tagName
		return this
	}

	setAttrs(attrs: [string, string][]) {
		this.attrs = attrs
		return this
	}

	setPreTags(preTags: IXMLSimple[]) {
		this.preTags = preTags
		return this
	}

	setPostTags(postTags: IXMLSimple[]) {
		this.postTags = postTags
		return this
	}

	build() {
		assert(this.tagName)
		assert(this.attrs)
		return new XMLOpenableNodeArgs(
			this.tagName,
			this.attrs,
			this.preTags,
			this.postTags
		)
	}
}

export class XMLOpenableNodeArgs {
	static builder() {
		return new XMLOpenableNodeArgsBuilder()
	}

	constructor(
		readonly tagName: string,
		readonly attrs: [string, string][],
		readonly preTags: IXMLSimple[],
		readonly postTags: IXMLSimple[]
	) {}
}

export class XMLOpenableNode implements IXMLOpenableNode {
	private readonly tagName: string
	private readonly attrs: [string, string][]
	private readonly preTags: IXMLSimple[]
	private readonly postTags: IXMLSimple[]

	pre() {
		const newline = getNewline()
		return this.preTags
			.map((tag) => tag.toXML())
			.flat()
			.map((x) => `${x}${newline}`)
	}

	tag(): [string, string] {
		return [
			`<${this.tagName} ${printAttrs(this.attrs)}>`,
			`<${this.tagName} />`
		]
	}

	post() {
		const newline = getNewline()
		return this.postTags
			.map((x) => x.toXML())
			.flat()
			.map((x) => `${newline}${x}`)
	}

	constructor(args: XMLOpenableNodeArgs) {
		const { tagName, attrs, preTags, postTags } = args
		assert(isIdentifier(tagName))
		this.tagName = tagName
		this.attrs = toValidAttributes(attrs)
		this.preTags = preTags
		this.postTags = postTags
	}
}

export class XMLGenerator {
	private readonly XMLStream: (
		resource: IOwnedStream<IXMLDebuggable>
	) => ICommonStream<string>

	private readonly toXML: (source: IXMLDebuggable) => string[]

	fromStream(stream: IOwnedStream<IXMLDebuggable>) {
		return XMLWrapper(this.wrapperNode, this.XMLStream(stream))
	}

	fromNode(node: IXMLDebuggable) {
		return this.toXML(node).join(getNewline())
	}

	constructor(
		genTable: IXMLGenerationTable,
		private readonly wrapperNode: IXMLOpenableNode
	) {
		this.XMLStream = XMLStream(genTable)
		this.toXML = (node: IXMLDebuggable) => toXML(node, genTable)
	}
}

export abstract class XMLAttrTable implements IXMLAttrTable {
	abstract builderProcess(
		builder: TreePairGenerationTable.Builder<INode>
	): TreePairGenerationTable.Builder<INode>

	private readonly delegate: TreePairGenerationTable<INode>

	get(
		parentType: IValidNodeType,
		childType: IValidNodeType
	): false | IXMLAttributeGenerator {
		return this.delegate.generate(parentType, childType)
	}

	constructor(types: readonly IValidNodeType[]) {
		this.delegate = this.builderProcess(
			new TreePairGenerationTable.Builder<INode>(types)
		).build()
	}
}

export abstract class XMLTagTable implements IXMLTagTable {
	private readonly delegate: IValidationTable<INode>

	abstract builderProcess(
		builder: TreeTable.BaseBuilder<INode, boolean>
	): TreeValidationTable.Builder<INode>

	get(
		parentType: IValidNodeType,
		childType: IValidNodeType,
		child: INode
	): boolean {
		return this.delegate.validate(parentType, childType, child)
	}

	constructor(types: readonly IValidNodeType[]) {
		this.delegate = this.builderProcess(
			new TreeValidationTable.Builder<INode>(types).withDefault(F)
		).build()
	}
}

export class XMLGenerationTable implements IXMLGenerationTable {
	toAttr(
		parentType: IValidNodeType,
		childType: IValidNodeType
	): false | IXMLAttributeGenerator {
		return this.attrs.get(parentType, childType)
	}

	isTag(
		parentType: IValidNodeType,
		childType: IValidNodeType,
		child: INode
	): boolean {
		return this.tags.get(parentType, childType, child)
	}

	constructor(
		private readonly attrs: IXMLAttrTable,
		private readonly tags: IXMLTagTable
	) {}
}
