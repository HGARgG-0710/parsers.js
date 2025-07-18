import { SingleChildNode } from "../../../classes/Node.js"
import { SingletonStream } from "../../../classes/Stream.js"
import type { INode, IOwnedStream } from "../../../interfaces.js"
import { GroupBodyStream, GroupLimitStream } from "../Group.js"

const NonCaptureGroup = SingleChildNode("non-capture-group")
const NonCaptureGroupStream = SingletonStream(
	(input: IOwnedStream<INode<string>>) => new NonCaptureGroup(input.curr)
)

export function HandleNonCaptureGroup(input: IOwnedStream<string>) {
	input.next() // :
	return [
		NonCaptureGroupStream(),
		GroupBodyStream(),
		// TODO: THIRD ITEM - the "main" chooser! ADD IT (this is the recursion spot)
		GroupLimitStream()
	]
}
