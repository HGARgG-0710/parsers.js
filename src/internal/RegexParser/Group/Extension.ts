import type { IOwnedStream } from "../../../interfaces.js"
import { TableHandler } from "../../../objects.js"
import { SingletonWrapperStream } from "../../../samples/Stream.js"
import { ObjectMap } from "../../../samples/TerminalMap.js"
import { GroupBodyStream, GroupLimitStream } from "../Group.js"
import { IgnoreCaseGroup } from "../Nodes.js"
import { BasicPeekHash, ParseRegexRecursively } from "../Parser.js"
import { HandleSingleChar } from "../SingleChar.js"

const IgnoreCaseGroupStream = SingletonWrapperStream(IgnoreCaseGroup)

export const HandleExtensionGroup = (recursiveParser = ParseRegexRecursively) =>
	TableHandler(
		new BasicPeekHash(
			ObjectMap(
				{
					i: function (input: IOwnedStream<string>) {
						input.next() // #
						input.next() // i
						return [
							IgnoreCaseGroupStream(),
							GroupBodyStream(),
							recursiveParser,
							GroupLimitStream()
						]
					}
				},
				HandleSingleChar
			)
		)
	)
