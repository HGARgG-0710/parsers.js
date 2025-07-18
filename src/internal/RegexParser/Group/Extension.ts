import { TableHandler } from "../../../classes.js"
import { BasicHash } from "../../../classes/HashMap.js"
import { SingleChildNode } from "../../../classes/Node.js"
import { SingletonStream } from "../../../classes/Stream.js"
import type { INode, IOwnedStream } from "../../../interfaces.js"
import { ObjectMap } from "../../../samples/TerminalMap.js"
import { peek } from "../../../utils/Stream.js"
import { GroupBodyStream, GroupLimitStream } from "../Group.js"
import { SingleCharStream } from "../SingleChar.js"

const IgnoreCaseGroup = SingleChildNode("ignore-case-group")
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
						// TODO: THIRD ITEM - the "main" chooser! ADD IT (this is the recursion spot)
						GroupLimitStream()
					]
				}
			},
			SingleCharStream
		)
	)
)
