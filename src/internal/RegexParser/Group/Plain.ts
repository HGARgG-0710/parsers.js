import { PeekStream } from "../../../objects/Stream.js"
import { SingletonWrapperStream } from "../../../samples/Stream.js"
import { GroupBodyStream, GroupLimitStream } from "../Group.js"
import { Group } from "../Nodes.js"
import { ParseRegexRecursively } from "../Parser.js"

export const GroupStream = SingletonWrapperStream(Group)

export function HandlePlainGroup(recursiveParser = ParseRegexRecursively) {
	return [
		GroupStream(),
		GroupBodyStream(),
		recursiveParser,
		GroupLimitStream(),
		PeekStream()
	]
}
