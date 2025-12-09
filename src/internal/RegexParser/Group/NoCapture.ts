import { type IRawStreamArray } from "../../../interfaces.js"
import { Parametrized, type Regex } from "../../../objects.js"
import { skip } from "../../../objects/Error.js"
import { PeekStream } from "../../../objects/Stream.js"
import { SingletonWrapperStream } from "../../../samples/Stream.js"
import { GroupBodyStream, GroupLimitStream } from "../Group.js"
import { NoCaptureGroup } from "../Nodes.js"
import { ParseRegexRecursively } from "../ParserBuilder.js"

const skipEq = skip("=")

const NoCaptureGroupStream = SingletonWrapperStream(NoCaptureGroup)
const NoCaptureGroupLimitStream = GroupLimitStream((input) => {
	skipEq(input) // =
	return 0
})

export const HandleNoCaptureGroup = new Parametrized(
	(extensions: Regex.Extension[]) => (): IRawStreamArray =>
		[
			NoCaptureGroupStream(),
			GroupBodyStream(),
			ParseRegexRecursively.for(extensions),
			NoCaptureGroupLimitStream(),
			PeekStream()
		]
)
