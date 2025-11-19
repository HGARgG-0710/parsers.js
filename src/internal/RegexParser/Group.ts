import type { IRawStreamArray, IStreamPredicate } from "../../interfaces.js"
import { ArrayBuilder } from "../../objects.js"
import { skip } from "../../objects/Error.js"
import { LimitStream } from "../../objects/Stream.js"
import {
	CollectionStream,
	EndBracketStream,
	isCurr,
	isNotNonEscapedNext
} from "../../samples/Stream.js"
import { consumable } from "../../utils/Stream.js"
import { HandleExtensionGroup } from "./Group/Extension.js"
import { HandleNoCaptureGroup } from "./Group/NoCapture.js"
import { HandlePlainGroup } from "./Group/Plain.js"
import { GroupBody } from "./Nodes.js"
import { CurrCharHandler } from "./Utils/CurrCharHandler.js"

const skipOpbrack = skip("(")

export function GroupLimitStream(from?: IStreamPredicate<string>) {
	return EndBracketStream(
		LimitStream.Limits.builder<string>()
			.setFrom((input) => {
				skipOpbrack(input) // (
				return from ? from(input) : 0
			})
			.setIsEmpty(isCurr(")"))
			.setLongAs(isNotNonEscapedNext(")"))
			.build()
	)
}

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

export const maybeGroup = {
	"(": GroupHandler
}
