import type { INode, IRawStreamArray } from "../../../../interfaces.js"
import { LimitStream, PeekStream } from "../../../../objects/Stream.js"
import {
	CollectionStream,
	EndBracketStream,
	isCurr,
	isNotNonEscapedNext
} from "../../../../samples/Stream.js"
import { getArrayConsumable } from "../../../../utils/Stream.js"
import { ClassEndMarkerStream, EnableClbrackStream } from "../Contract.js"
import { CharClass } from "../Nodes.js"
import { skipSqopbrack } from "../Utils/limits.js"
import { HandleClassElements } from "./Common.js"

const CharClassLimitStream = EndBracketStream(
	new LimitStream.Limits.Builder<string>()
		.setFrom((input) => skipSqopbrack(input))
		.setIsEmpty(isCurr("]"))
		.setLongAs(isNotNonEscapedNext("]"))
)

const CharClassStream = CollectionStream(CharClass, getArrayConsumable<INode>())

export function HandleCharClass(): IRawStreamArray {
	return [
		CharClassStream(),
		HandleClassElements,
		ClassEndMarkerStream(),
		CharClassLimitStream(),
		PeekStream(),
		EnableClbrackStream()
	]
}

export const maybeCharClass = {
	"[": HandleCharClass
}
