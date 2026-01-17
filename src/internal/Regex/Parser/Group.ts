import type {
	INode,
	IRawStreamArray,
	IStreamPredicate
} from "../../../interfaces.js"
import { Parametrized, Regex } from "../../../objects.js"
import { skip } from "../../../objects/Error.js"
import { LimitDepthMarks, LimitStream } from "../../../objects/Stream.js"
import {
	CollectionStream,
	isCurr,
	isNotNonEscapedNext,
	RecursiveBracketStream
} from "../../../samples/Stream.js"
import { getArrayConsumable } from "../../../utils/Stream.js"
import { RegexMarks } from "./Contract.js"
import { HandleExtensionGroup } from "./Group/Extension.js"
import { HandlePlainGroup } from "./Group/Plain.js"
import { GroupBody } from "./Nodes.js"
import { CurrCharHandler } from "./Utils/CurrCharHandler.js"

const skipOpbrack = skip("(")

export function GroupLimitStream(from?: IStreamPredicate<string>) {
	return RecursiveBracketStream(
		new LimitDepthMarks(RegexMarks.Group),
		new LimitStream.Limits.Builder<string>()
			.setFrom((input) => {
				skipOpbrack(input) // (
				return from ? from(input) : 0
			})
			.setIsEmpty(isCurr(")"))
			.setLongAs(isNotNonEscapedNext(")"))
	)
}

export const GroupBodyStream = CollectionStream(
	GroupBody,
	getArrayConsumable<INode>()
)

const GroupHandler = new Parametrized((extensions: Regex.Extension[]) =>
	CurrCharHandler<IRawStreamArray>(
		{
			"#": HandleExtensionGroup.for(extensions)
		},
		HandlePlainGroup.for(extensions)
	)
)

export const maybeGroup = new Parametrized((extensions: Regex.Extension[]) => ({
	"(": GroupHandler.for(extensions)
}))
