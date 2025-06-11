import { NodeSystem } from "../classes.js"
import { ContentNode, RecursiveNode, TokenNode } from "../classes/Node.js"

export function PlainNodes<Type = any>(
	token: Type[],
	content: Type[],
	recursive: Type[]
) {
	return new NodeSystem([
		[TokenNode, token],
		[ContentNode, content],
		[RecursiveNode, recursive]
	])
}
