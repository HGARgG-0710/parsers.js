import { ObjectPool } from "../../objects.js"
import { splitNewlines } from "../../samples/space.js"
import {
	closeTag,
	openTag,
	tabbed,
	toTagContent,
	toXML
} from "../../samples/xml.js"
import {
	isContentNodeLike,
	isSingleChildNodeLike
} from "../../utils/Node.js"
import { NodeFactory } from "./NodeFactory.js"
import { PoolableNode } from "./PoolableNode.js"
import { PreNodeFactory } from "./before/PreNodeFactory.js"

class MaybeContainingNode extends PoolableNode {
	static fromPlain(x, nodeMaker) {
		if (!isContentNodeLike(x)) return false
		if (!this.is(x)) return false
		return new this(x.value)
	}

	setValue(newValue) {
		this._value = newValue
	}

	get value() {
		return this._value
	}

	copy() {
		return new this.constructor(tryCopy(this.value))
	}

	toJSON() {
		return {
			type: this.type,
			value: this.value
		}
	}

	toXMLRaw() {
		const valueNewlines = splitNewlines(String(this.value))
		return this.isProperXMLTagContent
			? valueNewlines.map((item) => toTagContent(item))
			: valueNewlines
	}

	toXMLWrapped(attrConverter, isTag) {
		const { type } = this
		const oTag = openTag(type, attrConverter ? attrConverter(this) : [])
		const tagContentFormatted = isTag ? tabbed(this.toXMLRaw()) : []
		const cTag = closeTag(type)
		return [oTag, ...tagContentFormatted, cTag]
	}

	toXML(table) {
		const asAttrs = table.toAttr(this.type, this.type)
		const isTag = table.isTag(this.type, this.type, this)
		const isRaw = !(asAttrs || isTag)
		return isRaw ? this.toXMLRaw() : this.toXMLWrapped(asAttrs, isTag)
	}

	debugPrint() {
		return `${this.debugName} { value: ${this.value} }`
	}

	constructor(value) {
		super()
		this.setValue(value)
	}
}

const makeCachedContentNodeFactory = PreNodeFactory(MaybeContainingNode)

// ! INTERNAL DOC [important] - this doesn't actually implement PoolableNode, just the BaseNode,
// 		even though it inherits from it
export const CachedContentNode = NodeFactory(function (type, debugName) {
	const baseClass = makeCachedContentNodeFactory(type, debugName)
	const instanceMap = new Map()

	function getCachedInstance(value) {
		return instanceMap.get(value)
	}

	function cacheNewInstance(value) {
		const newInstance = new baseClass(value)
		instanceMap.set(value, newInstance)
		return newInstance
	}

	return class C extends baseClass {
		static make(value) {
			return getCachedInstance(value) || cacheNewInstance(value)
		}

		constructor(value) {
			return C.make(value)
			super(value)
		}
	}
})

class PreContentNode extends MaybeContainingNode {
	init(value) {
		this.setValue(value)
		return this
	}
}

class PreSingleChildNode extends PoolableNode {
	// ! pre-doc [important]: the `fromPlain` static methods can be called OUTSIDE the `utils.Node.fromObject`
	//		reason: the user should be able to write their own equivalent deserializer-code
	// 			for raw JSON objects
	static fromPlain(x, nodeMaker) {
		if (!isSingleChildNodeLike(x)) return false
		if (!this.is(x)) return false
		return new this(nodeMaker(x.child))
	}

	copy() {
		return this.child
			? new this.constructor(tryCopy(this.child))
			: new this.constructor()
	}

	init(newChild) {
		this.child = newChild
		return this
	}

	get lastChild() {
		return this.child ? 0 : -1
	}

	toXML(table) {
		const { child, type } = this
		const hasChild = !!child
		const attrConverter = hasChild && table.toAttr(type, child.type)
		const isTag = hasChild && table.isTag(type, child.type, child)
		const openTag = openingTag(
			type,
			attrConverter ? attrConverter(child) : []
		)
		const tagContent = isTag ? toXML(child, table) : []
		const closeTag = closingTag(type)
		return [openTag, ...tabbed(tagContent), closeTag]
	}

	toJSON() {
		return {
			type: this.type,
			child: this.child
		}
	}

	debugPrint() {
		return `${this.debugName}${
			this.child ? ` { child: ${this.child.debugPrint()} }` : ""
		}`
	}
}

/**
 * This is an `INodeTypeFactory<T, [Value | undefined]>` for creation of
 * `INode` instances with `.type` field (on prototype) defined by `type: T`
 * and a single child-node, which is reflected in tree-iteration algorithms.
 * In cases when a child is guaranteed to be the same preferable over
 * `RecursiveNode`.
 */
export const SingleChildNode = NodeFactory(
	PreNodeFactory(PreSingleChildNode)
)

const makeContentNodeFactory = PreNodeFactory(PreContentNode)

/**
 * This is an `INodeTypeFactory<T, [Value | undefined]>` for creation of `INode`
 * instances with `.type` field (on prototype) defined by `type: T`
 * and `.value: Value`, which is provided by the user within the
 * resulting class's constructor.
 *
 * Note: the instances of `INodeType< [Value | undefined]>`s
 * returned by `ContentNode` are poolable using the `ObjectPool`
 */

export const ContentNode = NodeFactory(function (type, debugName) {
	const baseClass = makeContentNodeFactory(type, debugName)
	return class C extends baseClass {
		static pool = new ObjectPool(C)

		get pool() {
			return C.pool
		}
	}
})
