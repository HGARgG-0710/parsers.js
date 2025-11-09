import type { ICollectionNode, IOwnedStream } from "../../../interfaces.js"
import { skip } from "../../../objects/Error.js"
import { PeekStream } from "../../../objects/Stream.js"
import { EndBracketStream, isNonEscaped } from "../../../samples/Stream.js"
import { BoundaryClass } from "../Nodes.js"
import { ClassStream, HandleClass } from "./Common.js"

const skipBoundary = skip("b")
const skipOpbrack = skip("{")

const BoundaryClassLimitStream = EndBracketStream(isNonEscaped("}"))

class BoundaryClassStream extends ClassStream<ICollectionNode> {
	protected spawnTarget(): ICollectionNode {
		return new BoundaryClass()
	}
}

const BoundaryClassHandler = HandleClass(() => new BoundaryClassStream())

export function HandleMaybeBoundaryClass(input: IOwnedStream<string>) {
	input.next() // \
	return HandleBoundaryClass(input)
}

export function HandleBoundaryClass(input: IOwnedStream<string>) {
	skipBoundary(input) // b
	skipOpbrack(input) // {
	return [BoundaryClassHandler, BoundaryClassLimitStream(), PeekStream()]
}
