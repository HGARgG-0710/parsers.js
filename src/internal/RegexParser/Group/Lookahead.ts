import { SingleChildNode } from "../../../classes/Node.js"
import { SingletonStream } from "../../../classes/Stream.js"
import type { INode, IOwnedStream } from "../../../interfaces.js"
import { GroupBodyStream, GroupLimitStream } from "../Group.js"
import { ParseRegexRecursively } from "../Parser.js"

const LookaheadGroup = SingleChildNode("lookahead-group")
const LookaheadGroupStream = SingletonStream(
	(input: IOwnedStream<INode<string>>) => new LookaheadGroup(input.curr)
)

export function HandleLookaheadGroup(input: IOwnedStream<string>) {
	input.next() // =
	return [
		LookaheadGroupStream(),
		GroupBodyStream(),
		ParseRegexRecursively,
		GroupLimitStream()
	]
}
