import type { ITypeCheckable, IValidNodeType } from "../interfaces.js"
import { NodeSystem } from "../objects.js"
import {
	ContentNode,
	RecursiveNode,
	SingleChildNode,
	TokenNode
} from "../objects/Node.js"

/**
 * This is a template for the most basic complete `NodeSystem` possible.
 * Accepts three arrays of `T` - the type employed for the `.type` properties.
 * It is based off `token` - `TokenNode`s, `content` - `Content`s,
 * `recursive` - `RecursiveNode`s.
 *
 * It only has 4 (all optional) categories of node-types.
 *
 * It is complete, because:
 *
 * 1. It can treat elementaries (`TokenNode`)
 * 2. It can treat recursion (`RecursiveNode`)
 * 3. It can treat simple low-level data-wrappers (`ContentNode`)
 * 4. [bonus] It can represent deep one-value predicates (`SingleChildNode`)
 */
export function PlainNodes(
	token: IValidNodeType[] = [],
	content: IValidNodeType[] = [],
	recursive: IValidNodeType[] = [],
	single: IValidNodeType[] = []
) {
	return new NodeSystem([
		[TokenNode, token],
		[ContentNode, content],
		[RecursiveNode, recursive],
		[SingleChildNode, single]
	])
}

export class EitherType implements ITypeCheckable {
	private readonly components: ITypeCheckable[]

	is(x: any) {
		return this.components.some((component) => component.is(x))
	}

	constructor(...components: ITypeCheckable[]) {
		this.components = components
	}
}
