import type { IOwnedStream, IRawStreamArray } from "../../interfaces.js"
import { ArrayBuilder } from "../../objects.js"
import {
	CollectionStream,
	EndBracketStream,
	isNonEscaped
} from "../../samples/Stream.js"
import { consumable } from "../../utils/Stream.js"
import { CurrCharHandler } from "./CurrCharHandler.js"
import { HandleExtensionGroup } from "./Group/Extension.js"
import { HandleNoCaptureGroup } from "./Group/NoCapture.js"
import { HandlePlainGroup } from "./Group/Plain.js"
import { GroupBody } from "./Nodes.js"

export const GroupLimitStream = EndBracketStream(isNonEscaped(")"))

export const GroupBodyStream = CollectionStream(
	GroupBody,
	consumable(new ArrayBuilder())
)

const GroupHandler = CurrCharHandler<IRawStreamArray>(
	{
		"#": HandleExtensionGroup(),
		"=": HandleNoCaptureGroup
	},
	HandlePlainGroup()
)

function handleGroup(input: IOwnedStream<string>) {
	input.next() // (
	return GroupHandler(input)
}

export const maybeGroup = {
	"(": handleGroup
}
