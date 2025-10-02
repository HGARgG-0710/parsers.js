import type { IOwnedStream } from "../../../interfaces.js"
import { WrapperStream } from "../../../samples/Stream.js"
import { GroupBodyStream, GroupLimitStream } from "../Group.js"
import { LookaheadGroup } from "../Nodes.js"
import { ParseRegexRecursively } from "../Parser.js"

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
