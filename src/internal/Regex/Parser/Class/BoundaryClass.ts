import type {
	INode,
	IRawStreamArray,
	IRecursiveNode
} from "../../../../interfaces.js"
import { skip } from "../../../../objects/Error.js"
import { LimitStream, PeekStream } from "../../../../objects/Stream.js"
import { EndBracketStream } from "../../../../samples/Stream.js"
import { BoundaryClass } from "../Nodes.js"
import { EnableClbrackStream } from "../Recursive.js"
import {
	isCurrClbrace,
	isNotNonEscapedNextClbrace,
	skipOpbrace
} from "../Utils/limits.js"
import { ClassStream, HandleClass } from "./Common.js"

const skipB = skip("b")

const BoundaryClassLimitStream = EndBracketStream(
	new LimitStream.Limits.Builder()
		.setFrom((input) => {
			skipB(input) // b
			skipOpbrace(input) // {
			return 0
		})
		.setIsEmpty(isCurrClbrace)
		.setLongAs(isNotNonEscapedNextClbrace)
)

class BoundaryClassStream extends ClassStream<IRecursiveNode> {
	protected spawnNode(children: INode[]): IRecursiveNode {
		return new BoundaryClass(children)
	}
}

const BoundaryClassHandler = HandleClass(() => new BoundaryClassStream())

export function HandleBoundaryClass(): IRawStreamArray {
	return [
		BoundaryClassHandler,
		BoundaryClassLimitStream(),
		PeekStream(),
		EnableClbrackStream()
	]
}
