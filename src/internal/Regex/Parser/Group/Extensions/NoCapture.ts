import type { IRawStreamArray } from "../../../../../interfaces.js"
import { Parametrized, Regex } from "../../../../../objects.js"
import { skip } from "../../../../../objects/Error.js"
import { PeekStream } from "../../../../../objects/Stream.js"
import { SingletonWrapperStream } from "../../../../../samples/Stream.js"
import { GroupBodyStream } from "../../Group.js"
import { NoCaptureGroup } from "../../Nodes.js"
import { ParseRegexRecursively } from "../../ParserBuilder.js"
import { ExtensionGroupLimitStream } from "../Extension.js"

const skipEq = skip("=")
const NoCaptureGroupStream = SingletonWrapperStream(NoCaptureGroup)
const NoCaptureGroupLimitStream = ExtensionGroupLimitStream((input) => {
	skipEq(input) // n
	return 0
})

export const NoCaptureExtensionGroup = new Parametrized(
	(extensions: Regex.Extension[]) => (): IRawStreamArray =>
		[
			NoCaptureGroupStream(),
			GroupBodyStream(),
			ParseRegexRecursively.for(extensions),
			NoCaptureGroupLimitStream(),
			PeekStream()
		]
)
