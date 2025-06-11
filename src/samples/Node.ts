import { NodeSystem } from "../classes.js"
import { ContentNode, RecursiveNode, TokenNode } from "../classes/Node.js"

export function PlainNodes<T = any>(token: T[], content: T[], recursive: T[]) {
	return new NodeSystem([
		[TokenNode, token],
		[ContentNode, content],
		[RecursiveNode, recursive]
	])
}
