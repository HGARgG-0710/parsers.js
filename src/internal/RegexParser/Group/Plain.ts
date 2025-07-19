import { SingleChildNode } from "../../../classes/Node.js"
import { SingletonStream } from "../../../classes/Stream.js"
import { GroupBodyStream, GroupLimitStream } from "../Group.js"

const Group = SingleChildNode("group")
const GroupStream = SingletonStream((input) => new Group(input.curr))

export function HandlePlainGroup() {
	return [
		GroupStream(),
		GroupBodyStream(),
		,
		// TODO: THIRD ITEM - the "main" chooser! ADD IT (this is the recursion spot)
		GroupLimitStream()
	]
}
