import type { IRawStreamArray } from "../../../../../interfaces.js"
import { Parametrized, Regex } from "../../../../../objects.js"
import { skip } from "../../../../../objects/Error.js"
import { PeekStream } from "../../../../../objects/Stream.js"
import { SingletonWrapperStream } from "../../../../../samples/Stream.js"
import { GroupBodyStream } from "../../Group.js"
import { IgnoreCaseGroup } from "../../Nodes.js"
import { ParseRegexRecursively } from "../../ParserBuilder.js"
import { ExtensionGroupLimitStream } from "../Extension.js"

const skipIgnoreCase = skip("i")
const IgnoreCaseGroupStream = SingletonWrapperStream(IgnoreCaseGroup)
const IgnoreCaseLimitStream = ExtensionGroupLimitStream((input) => {
	skipIgnoreCase(input) // i
	return 0
})

export const IgnoreCaseExtensionGroup = new Parametrized(
	(extensions: Regex.Extension[]) => (): IRawStreamArray =>
		[
			IgnoreCaseGroupStream(),
			GroupBodyStream(),
			ParseRegexRecursively.for(extensions),
			IgnoreCaseLimitStream(),
			PeekStream()
		]
)
