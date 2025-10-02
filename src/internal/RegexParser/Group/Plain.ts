import { WrapperStream } from "../../../samples/Stream.js"
import { GroupBodyStream, GroupLimitStream } from "../Group.js"
import { Group } from "../Nodes.js"
import { ParseRegexRecursively } from "../Parser.js"

const GroupStream = WrapperStream(Group)

export function HandlePlainGroup() {
	return [
		GroupStream(),
		GroupBodyStream(),
		ParseRegexRecursively,
		GroupLimitStream()
	]
}
