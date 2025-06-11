import { NodeSystem } from "../classes.js"
import { ContentNode, RecursiveNode, TokenNode } from "../classes/Node.js"

/**
 * This is a template for the most basic complete `NodeSystem` possible.
 * Accepts three arrays of `T` - the type employed for the `.type` properties.
 * It is based off `token` - `TokenNode`s, `content` - `Content`s,
 * `recursive` - `RecursiveNode`s.
 *
 * It only has 3 categories of node-types, and therefore, rather minimalistic.
 *
 * It is complete, because:
 *
 * 1. It can treat elementaries (`TokenNode`)
 * 2. It can treat recursion (`RecursiveNode`)
 * 3. It can treat simple predicates (`ContentNode`), and nest them (deep `ContentNode`)
 */
export function PlainNodes<T = any>(token: T[], content: T[], recursive: T[]) {
	return new NodeSystem([
		[TokenNode, token],
		[ContentNode, content],
		[RecursiveNode, recursive]
	])
}
