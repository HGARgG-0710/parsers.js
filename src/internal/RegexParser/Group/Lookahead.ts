import type { IOwnedStream } from "../../../interfaces.js"
import { SingletonWrapperStream } from "../../../samples/Stream.js"
import { GroupBodyStream, GroupLimitStream } from "../Group.js"
import { LookaheadGroup } from "../Nodes.js"
import { ParseRegexRecursively } from "../Parser.js"

const LookaheadGroupStream = SingletonWrapperStream(LookaheadGroup)

export function HandleLookaheadGroup(input: IOwnedStream<string>) {
	input.next() // =
	return [
		LookaheadGroupStream(),
		GroupBodyStream(),
		ParseRegexRecursively,
		GroupLimitStream()
	]
}
