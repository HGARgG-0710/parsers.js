import type {
	ICollectionNode,
	ICompositeStream,
	IOwnedStream,
	IPeekable,
	IRawStreamArray
} from "../../../interfaces.js"
import { PeekStream } from "../../../objects/Stream.js"
import { EndBracketStream, isNonEscaped } from "../../../samples/Stream.js"
import { CharClass } from "../Nodes.js"
import { ClassStream, HandleClass } from "./Common.js"

const CharClassLimitStream = EndBracketStream(isNonEscaped("]"))

class CharClassStream extends ClassStream<ICollectionNode> {
	protected spawnTarget(): ICollectionNode {
		return new CharClass()
	}
}

const CharClassHandler = HandleClass(() => new CharClassStream())

export function HandleCharClass(
	this: ICompositeStream,
	input: IOwnedStream<string> & IPeekable<string>
): IRawStreamArray {
	input.next() // [
	return [CharClassHandler, CharClassLimitStream(), PeekStream()]
}

export const maybeCharClass = {
	"[": HandleCharClass
}
