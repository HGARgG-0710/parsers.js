import type { IRawStreamArray, IStreamPredicate } from "../../../interfaces.js"
import { ArrayBuilder, Parametrized, Regex } from "../../../objects.js"
import { skip } from "../../../objects/Error.js"
import { LimitDepthMarks, LimitStream } from "../../../objects/Stream.js"
import {
	CollectionStream,
	isCurr,
	isNotNonEscapedNext,
	RecursiveBracketStream
} from "../../../samples/Stream.js"
import { consumableIterable } from "../../../utils/Stream.js"
import { HandleExtensionGroup } from "./Group/Extension.js"
import { HandleNoCaptureGroup } from "./Group/NoCapture.js"
import { HandlePlainGroup } from "./Group/Plain.js"
import { GroupBody } from "./Nodes.js"
import { RegexMarks } from "./Recursive.js"
import { CurrCharHandler } from "./Utils/CurrCharHandler.js"

const skipOpbrack = skip("(")

export function GroupLimitStream(from?: IStreamPredicate<string>) {
	return RecursiveBracketStream(
		new LimitDepthMarks(RegexMarks.Group),
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
	consumableIterable(new ArrayBuilder())
)

const GroupHandler = new Parametrized((extensions: Regex.Extension[]) =>
	CurrCharHandler<IRawStreamArray>(
		{
			"#": HandleExtensionGroup.for(extensions),
			"=": HandleNoCaptureGroup.for(extensions)
		},
		HandlePlainGroup.for(extensions)
	)
)

export const maybeGroup = new Parametrized((extensions: Regex.Extension[]) => ({
	"(": GroupHandler.for(extensions)
}))
