import { SingleChildNode } from "../../../classes/Node.js"
import { WrapperStream } from "../../../samples/Stream.js"
import { GroupBodyStream, GroupLimitStream } from "../Group.js"
import { ParseRegexRecursively } from "../Parser.js"

const Group = SingleChildNode("group")
const GroupStream = WrapperStream(Group)

export function HandlePlainGroup() {
	return [
		GroupStream(),
		GroupBodyStream(),
		ParseRegexRecursively,
		GroupLimitStream()
	]
}
