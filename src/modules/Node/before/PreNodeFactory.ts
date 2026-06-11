import * as Pools from "../../../global/Pools.js"
import type { INodeType, IValidNodeType } from "../../../interfaces.js"
import { ObjectPool } from "../../../objects.js"
import { isType } from "../../../utils/Node.js"

// Fuck you, TypeScript.
// I fucking hate you, you dumb piece of shit.
// It lacks support for passing Generic Expressions (lazily-evaluated generics...)
// If it had it, there wouldn't be a fucking need for doing... this
export function PreNodeFactory<K extends INodeType = INodeType>(
	preNode: any
) {
	return function (type: IValidNodeType, debugName: string): K {
		class concreteNode extends preNode {
			static readonly type = type
			static readonly is = isType(type)
			static readonly pool = Pools.Node.add(
				new ObjectPool(concreteNode as any)
			)
			static readonly debugName = debugName

			protected get pool() {
				return concreteNode.pool
			}

			get type() {
				return type
			}

			get debugName() {
				return concreteNode.debugName
			}
		}

		return concreteNode as unknown as K
	}
}
