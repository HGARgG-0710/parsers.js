import { SingletonWrapperStream } from "../../../samples/Stream.js"
import { GroupBodyStream, GroupLimitStream } from "../Group.js"
import { Group } from "../Nodes.js"
import { ParseRegexRecursively } from "../Parser.js"

const GroupStream = SingletonWrapperStream(Group)

export function HandlePlainGroup() {
	return [
		GroupStream(),
		GroupBodyStream(),
		ParseRegexRecursively,
		GroupLimitStream()
	]
}
