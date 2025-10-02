import type { INode, IOwnedStream } from "../../../interfaces.js"
import { TableHandler } from "../../../objects.js"
import { BasicHash } from "../../../objects/HashMap.js"
import { SingletonStream } from "../../../objects/Stream.js"
import { ObjectMap } from "../../../samples/TerminalMap.js"
import { peek } from "../../../utils/Stream.js"
import { GroupBodyStream, GroupLimitStream } from "../Group.js"
import { IgnoreCaseGroup } from "../Nodes.js"
import { ParseRegexRecursively } from "../Parser.js"
import { HandleSingleChar } from "../SingleChar.js"

const IgnoreCaseGroupStream = SingletonStream(
	(input: IOwnedStream<INode<string>>) => new IgnoreCaseGroup(input.curr)
)

export const HandleExtensionGroup = TableHandler(
	new (BasicHash.extend(peek(1)))(
		ObjectMap(
			{
				i: function (input: IOwnedStream<string>) {
					input.next() // #
					input.next() // i
					return [
						IgnoreCaseGroupStream(),
						GroupBodyStream(),
						ParseRegexRecursively,
						GroupLimitStream()
					]
				}
			},
			HandleSingleChar
		)
	)
)
