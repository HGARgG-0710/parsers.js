import { functional } from "@hgargg-0710/one"
import assert from "assert"
import type {
	ICommandStream,
	IOwnedStream,
	IXMLAttrTable,
	IXMLDebuggable,
	IXMLOpenableNode,
	IXMLSimple,
	IXMLTagTable,
	IXMLVersion
} from "../interfaces.js"
import { XMLGenerationError } from "../objects/Error.js"
import { HandlerStream } from "../objects/Stream.js"
import { curr } from "../utils/Stream.js"
import { DelimitedStream } from "./Stream.js"
import { regex } from "./regex.js"

const { trivialCompose } = functional

export const XMLWrapper = DelimitedStream<string, IXMLOpenableNode>(
	"\t\n",
	(xmlNode) => {
		const [preLast, postFirst] = xmlNode.tag()
		return [
			[...xmlNode.pre(), preLast],
			[postFirst, ...xmlNode.post()]
		]
	}
)

export function XMLStream(attrs: IXMLAttrTable, tags: IXMLTagTable) {
	return HandlerStream<IXMLDebuggable, string>(
		trivialCompose(toXML(attrs, tags), curr)
	)
}

export function toXML(attrs: IXMLAttrTable, tags: IXMLTagTable) {
	return function (source: IXMLDebuggable) {
		if (!source.toXML) throw new XMLGenerationError(source)
		return source.toXML(attrs, tags)
	}
}

export function toValidAttributeValue(value: string) {
	return value.replaceAll('"', "&quot;")
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

export function isIdentifier(id: string) {
	return fullMaybeNamespaceId.test(id)
}

export function toValidProcessingInstructionContent(content: string) {
	return content.replaceAll("?>", "?&gt;")
}

export class XMLProcessingInstructionNode implements IXMLSimple {
	private readonly content: string

	toXML(): string {
		return `<?${this.target} ${this.content}?>`
	}

	constructor(private readonly target: string, content: string) {
		assert(isProcessingInstructionTarget(target))
		this.content = toValidProcessingInstructionContent(content)
	}
}

export class XMLCommentNode implements IXMLSimple {
	private readonly comment: string

	toXML(): string {
		return `<!--${this.comment}-->`
	}

	constructor(comment: string) {
		this.comment = toValidComment(comment)
	}
}

export class XMLDeclarationNode implements IXMLSimple {
	toXML(): string {
		return `<?xml version=${this.version} encoding=${
			this.encoding
		} standalone=${this.standalone ? "yes" : "no"}?>`
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
		return this.preTags.map((tag) => `${tag.toXML()}\n`)
	}

	tag(): [string, string] {
		return [
			`<${this.tagName} ${this.attrs
				.map(([key, value]) => `${key}="${value}"`)
				.join(" ")}>`,
			`<${this.tagName} />`
		]
	}

	post() {
		return this.postTags.map((x) => `\n${x.toXML()}`)
	}

	constructor(args: XMLOpenableNodeArgs) {
		const { tagName, attrs, preTags, postTags } = args
		assert(isIdentifier(tagName))
		this.tagName = tagName
		this.attrs = attrs.map(([key, value]) => {
			assert(isIdentifier(key))
			return [key, toValidAttributeValue(value)]
		})
		this.preTags = preTags
		this.postTags = postTags
	}
}

export class XMLGenerator {
	private readonly XMLStream: (
		resource: IOwnedStream<IXMLDebuggable>
	) => ICommandStream<string>

	private readonly toXML: (source: IXMLDebuggable) => string

	fromStream(stream: IOwnedStream<IXMLDebuggable>) {
		return XMLWrapper(this.wrapperNode, this.XMLStream(stream))
	}

	fromNode(node: IXMLDebuggable) {
		return this.toXML(node)
	}

	constructor(
		attrs: IXMLAttrTable,
		tags: IXMLTagTable,
		private readonly wrapperNode: IXMLOpenableNode
	) {
		this.XMLStream = XMLStream(attrs, tags)
		this.toXML = toXML(attrs, tags)
	}
}
