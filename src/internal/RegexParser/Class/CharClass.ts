import type {
	INode,
	IRawStreamArray,
	IRecursiveNode
} from "../../../interfaces.js"
import { skip } from "../../../objects/Error.js"
import { LimitStream, PeekStream } from "../../../objects/Stream.js"
import {
	EndBracketStream,
	isCurr,
	isNotNonEscapedNext
} from "../../../samples/Stream.js"
import { CharClass } from "../Nodes.js"
import { EnableClbrackStream } from "../Recursive.js"
import { ClassStream, HandleClass } from "./Common.js"

const skipSqopbrack = skip("[")

const CharClassLimitStream = EndBracketStream(
	LimitStream.Limits.builder<string>()
		.setFrom((input) => skipSqopbrack(input))
		.setIsEmpty(isCurr("]"))
		.setLongAs(isNotNonEscapedNext("]"))
		.build()
)

class CharClassStream extends ClassStream<IRecursiveNode> {
	protected spawnNode(children: INode[]): IRecursiveNode {
		return new CharClass(children)
	}
}

const CharClassHandler = HandleClass(() => new CharClassStream())

export function HandleCharClass(): IRawStreamArray {
	return [
		CharClassHandler,
		CharClassLimitStream(),
		PeekStream(),
		EnableClbrackStream()
	]
}

export const maybeCharClass = {
	"[": HandleCharClass
}
