import type { IStreamPredicate } from "../../../interfaces.js"
import { TableHandler } from "../../../objects.js"
import { skip } from "../../../objects/Error.js"
import { PeekStream } from "../../../objects/Stream.js"
import { SingletonWrapperStream } from "../../../samples/Stream.js"
import { ObjectMap } from "../../../samples/TerminalMap.js"
import { GroupBodyStream, GroupLimitStream } from "../Group.js"
import { IgnoreCaseGroup } from "../Nodes.js"
import { BasicPeekHash, ParseRegexRecursively } from "../Parser.js"
import { HandleSingleChar } from "../SingleChar.js"

const skipExtension = skip("#")
const skipIgnoreCase = skip("i")

function ExtensionGroupLimitStream(from: IStreamPredicate<string>) {
	return GroupLimitStream((input) => {
		skipExtension(input) // #
		return from(input)
	})
}

const IgnoreCaseGroupStream = SingletonWrapperStream(IgnoreCaseGroup)
const IgnoreCaseLimitStream = ExtensionGroupLimitStream((input) => {
	skipIgnoreCase(input) // i
	return 0
})

export const HandleExtensionGroup = (recursiveParser = ParseRegexRecursively) =>
	TableHandler(
		new BasicPeekHash(
			ObjectMap(
				{
					i: () => [
						IgnoreCaseGroupStream(),
						GroupBodyStream(),
						recursiveParser,
						IgnoreCaseLimitStream(),
						PeekStream()
					]
				},
				HandleSingleChar
			)
		)
	)
