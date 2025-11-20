import type {
	ICollectionNode,
	IOwnedStream,
	IRawStreamArray
} from "../../../interfaces.js"
import { skip } from "../../../objects/Error.js"
import { LimitStream, PeekStream } from "../../../objects/Stream.js"
import {
	EndBracketStream,
	isCurr,
	isNotNonEscapedNext
} from "../../../samples/Stream.js"
import { BoundaryClass } from "../Nodes.js"
import { EnableClbrackStream } from "../Recursive.js"
import { ClassStream, HandleClass } from "./Common.js"

const skipBoundary = skip("b")
const skipOpbrace = skip("{")

const BoundaryClassLimitStream = EndBracketStream(
	LimitStream.Limits.builder()
		.setFrom((input) => {
			skipBoundary(input) // b
			skipOpbrace(input) // {
			return 0
		})
		.setIsEmpty(isCurr("}"))
		.setLongAs(isNotNonEscapedNext("}"))
		.build()
)

class BoundaryClassStream extends ClassStream<ICollectionNode> {
	protected spawnTarget(): ICollectionNode {
		return new BoundaryClass()
	}
}

const BoundaryClassHandler = HandleClass(() => new BoundaryClassStream())

export function HandleMaybeBoundaryClass(
	input: IOwnedStream<string>
): IRawStreamArray {
	input.next() // \
	return HandleBoundaryClass()
}

export function HandleBoundaryClass(): IRawStreamArray {
	return [
		BoundaryClassHandler,
		BoundaryClassLimitStream(),
		PeekStream(),
		EnableClbrackStream()
	]
}
