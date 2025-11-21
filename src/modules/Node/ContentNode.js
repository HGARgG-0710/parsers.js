import { mixin } from "../../mixin.js"
import { BaseNode } from "./BaseNode.js"
import { NodeFactory } from "./NodeFactory.js"
import { PoolableNode } from "./PoolableNode.js"
import { PreNodeFactory } from "./before/PreNodeFactory.js"

class FromPlainConvertibleSingleItemNode extends BaseNode {
	static fromPlain(x, nodeMaker) {
		if (!isContentNodeSerializable(x)) return false
		return new this(x.value)
	}
}

const SingleItemNode = new mixin(
	{
		name: "SingleItemNode",
		properties: {}
	},
	[FromPlainConvertibleSingleItemNode, PoolableNode]
).toClass()

class MaybeContainingNode extends FromPlainConvertibleSingleItemNode {
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

	debugPrint() {
		return `${this.debugName} { value: ${this.value} }`
	}

	constructor(value) {
		super()
		this.setValue(value)
	}
}

const makeCachedContentNodeFactory = PreNodeFactory(MaybeContainingNode)

export const CachedContentNode = NodeFactory(function (type, debugName) {
	const factory = makeCachedContentNodeFactory(type, debugName)
	const instanceMap = new Map()

	function getCachedInstance(value) {
		return instanceMap.get(value)
	}

	function cacheNewInstance(value) {
		const newInstance = new factory(value)
		instanceMap.set(value, newInstance)
		return newInstance
	}

	return class extends factory {
		static make(value) {
			return getCachedInstance(value) || cacheNewInstance(value)
		}

		constructor(value) {
			throw new TypeError(
				"Cannot create a `CachedContentNode` instance via `new` call, use the static `make` method instead"
			)
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

class PreSingleChildNode extends SingleItemNode {
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
export const SingleChildNode = NodeFactory(PreNodeFactory(PreSingleChildNode))

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
	return makeContentNodeFactory(type, debugName)
})
