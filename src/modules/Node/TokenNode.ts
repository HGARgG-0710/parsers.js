import assert from "assert"
import type {
	INode,
	INodeMaker,
	IPoolNodeType,
	ITyped,
	IValidNodeType,
	IXMLGenerationTable
} from "../../interfaces.js"
import { isIdentifier, printValidAttrs } from "../../samples/xml.js"
import { isTyped } from "../../utils/Node.js"
import { PreNodeFactory } from "./before/PreNodeFactory.js"
import { NodeFactory } from "./NodeFactory.js"
import { PoolableNode } from "./PoolableNode.js"

abstract class PreTokenNode extends PoolableNode<[]> implements INode {
	protected ["constructor"]: new () => this

	static fromPlain(this: IPoolNodeType<[]>, x: any, nodeMaker: INodeMaker) {
		if (!isTyped(x)) return false
		return new this()
	}

	copy() {
		return new this.constructor()
	}

	init() {
		return this
	}

	toJSON(): ITyped {
		return { type: this.type }
	}

	toXML(table: IXMLGenerationTable): string[] {
		const { type } = this
		assert(isIdentifier(type))
		const attrConverter = table.toAttr(type, type)
		return [
			attrConverter
				? `<${type} ${printValidAttrs(attrConverter(this))} />`
				: `<${type} />`
		]
	}

	debugPrint(): string {
		return `${this.debugName}`
	}
}

const makeTokenNodeFactory = PreNodeFactory<IPoolNodeType<[]>>(PreTokenNode)

export const CachedTokenNode = NodeFactory(function (
	type: IValidNodeType,
	debugName: string
) {
	const factory = makeTokenNodeFactory(type, debugName)
	const cachedInstance = new factory()
	return class extends factory {
		static make() {
			return cachedInstance
		}

		constructor() {
			throw new TypeError(
				"cannot call constructor of a `CachedTokenNode` - use `.make()` method instead"
			)
			super()
		}
	}
})

/**
 * This is an `INodeTypeFactory<T, []>` for creation of simplest possible
 * `INode` instances. They contain no data, and have minimal memory
 * footprint. Their only useful property is `.type`, which is
 * added to the prototype of the respective `INodeType< []>`,
 * and has the value of `type: T`.
 *
 * Note: the `INode` instances of `INodeType< []>`s created
 * using `TokenNode` are poolable via `ObjectPool`
 */
export const TokenNode = NodeFactory(makeTokenNodeFactory)
