import { SingleChildNode } from "../../../classes/Node.js"
import { SingletonStream } from "../../../classes/Stream.js"
import type { INode, IOwnedStream } from "../../../interfaces.js"
import { GroupBodyStream, GroupLimitStream } from "../Group.js"

const LookbehindGroup = SingleChildNode("lookbehind-group")
const LookbehindGroupStream = SingletonStream(
	(input: IOwnedStream<INode<string>>) => new LookbehindGroup(input.curr)
)

export function HandleLookbehindGroup(input: IOwnedStream<string>) {
	input.next() // <
	return [
		LookbehindGroupStream(), 
		GroupBodyStream(), 	
		// TODO: THIRD ITEM - the "main" chooser! ADD IT (this is the recursion spot)
		GroupLimitStream()
	]
}
