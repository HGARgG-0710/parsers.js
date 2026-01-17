import type { INode, IRawStreamArray } from "../../../../interfaces.js"
import { skip } from "../../../../objects/Error.js"
import { LimitStream, PeekStream } from "../../../../objects/Stream.js"
import {
	CollectionStream,
	EndBracketStream
} from "../../../../samples/Stream.js"
import { getArrayConsumable } from "../../../../utils/Stream.js"
import { ClassEndMarkerStream, EnableClbrackStream } from "../Contract.js"
import { BoundaryClass } from "../Nodes.js"
import {
	isCurrClbrace,
	isNotNonEscapedNextClbrace,
	skipOpbrace
} from "../Utils/limits.js"
import { HandleClassElements } from "./Common.js"

const skipB = skip("b")

const BoundaryClassStream = CollectionStream(
	BoundaryClass,
	getArrayConsumable<INode>()
)

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

export function HandleBoundaryClass(): IRawStreamArray {
	return [
		BoundaryClassStream(),
		HandleClassElements,
		ClassEndMarkerStream(),
		BoundaryClassLimitStream(),
		PeekStream(),
		EnableClbrackStream()
	]
}
