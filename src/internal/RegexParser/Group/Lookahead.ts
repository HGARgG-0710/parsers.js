import { SingleChildNode } from "../../../classes/Node.js"
import type { IOwnedStream } from "../../../interfaces.js"
import { WrapperStream } from "../../../samples/Stream.js"
import { GroupBodyStream, GroupLimitStream } from "../Group.js"
import { ParseRegexRecursively } from "../Parser.js"

const LookaheadGroup = SingleChildNode("lookahead-group")
const LookaheadGroupStream = WrapperStream(LookaheadGroup)

export function HandleLookaheadGroup(input: IOwnedStream<string>) {
	input.next() // =
	return [
		LookaheadGroupStream(),
		GroupBodyStream(),
		ParseRegexRecursively,
		GroupLimitStream()
	]
}
