import type {
	ICarrierNode,
	ICarrierNodeType,
	ICellNode,
	ICellNodeType,
	INode,
	INodeMaker,
	IPoolNodeType,
	IValidNodeType
} from "../../interfaces.js"
import { tryCopy } from "../../utils.js"
import { isContentNodeSerializable } from "../../utils/Node.js"
import { PreNodeFactory } from "./before/PreNodeFactory.js"
import { NodeFactory } from "./NodeFactory.js"
import { PoolableNode } from "./PoolableNode.js"

abstract class SingleItemNode<Value = any> extends PoolableNode<[Value]> {
	protected ["constructor"]: new (value?: Value) => this

	static fromPlain<Value = any>(
		this: ICellNodeType<Value>,
		x: any,
		nodeMaker: INodeMaker<ICellNode<Value>>
	) {
		if (!isContentNodeSerializable(x)) return false
		return new this(x.value)
	}
}

abstract class MaybeContainingNode<Value = any>
	extends SingleItemNode<Value>
	implements ICarrierNode<Value>
{
	private _value: Value | undefined

	protected setValue(newValue: Value | undefined) {
		this._value = newValue
	}

	get value() {
		return this._value!
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

	debugPrint(): string {
		return `${this.debugName} { value: ${this.value} }`
	}

	constructor(value?: Value) {
		super()
		this.setValue(value)
	}
}

abstract class AlwaysContainingNode<
	Value = any
> extends MaybeContainingNode<Value> {
	constructor(value: Value) {
		super(value)
	}
}

const makeCachedContentNodeFactory =
	PreNodeFactory<ICarrierNodeType>(AlwaysContainingNode)

export const CachedContentNode = NodeFactory(function <V = any>(
	type: IValidNodeType,
	debugName: string
): ICarrierNodeType<V> {
	const factory = makeCachedContentNodeFactory(type, debugName)
	const instanceMap = new Map<V, ICarrierNode>()

	function getCachedInstance(value: V) {
		return instanceMap.get(value)
	}

	function cacheNewInstance(value: V) {
		const newInstance = new factory(value)
		instanceMap.set(value, newInstance)
		return newInstance
	}

	return class extends factory {
		static make(value: V) {
			return getCachedInstance(value) || cacheNewInstance(value)
		}

		constructor(value: V) {
			throw new TypeError(
				"Cannot create a `CachedContentNode` instance via `new` call, use the static `make` method instead"
			)
			super(value)
		}
	}
})

abstract class PreContentNode<Value = any>
	extends MaybeContainingNode<Value>
	implements ICellNode<Value>
{
	init(value?: Value | undefined) {
		this.setValue(value)
		return this
	}
}

abstract class PreSingleChildNode extends SingleItemNode<INode> {
	private child?: INode

	copy(): this {
		return this.child
			? new this.constructor(tryCopy(this.child))
			: new this.constructor()
	}

	init(newChild?: INode): this {
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

	debugPrint(): string {
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
	PreNodeFactory<IPoolNodeType<[INode]>>(PreSingleChildNode)
)

const makeContentNodeFactory = PreNodeFactory<ICellNodeType>(PreContentNode)

/**
 * This is an `INodeTypeFactory<T, [Value | undefined]>` for creation of `INode`
 * instances with `.type` field (on prototype) defined by `type: T`
 * and `.value: Value`, which is provided by the user within the
 * resulting class's constructor.
 *
 * Note: the instances of `INodeType< [Value | undefined]>`s
 * returned by `ContentNode` are poolable using the `ObjectPool`
 */

export const ContentNode = NodeFactory(function <Value = any>(
	type: IValidNodeType,
	debugName: string
): ICellNodeType<Value> {
	return makeContentNodeFactory(type, debugName)
})
