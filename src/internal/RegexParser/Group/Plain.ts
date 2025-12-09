import type { IOwnedStream } from "../../../interfaces.js"
import type { Regex } from "../../../objects.js"
import { PeekStream } from "../../../objects/Stream.js"
import { SingletonWrapperStream } from "../../../samples/Stream.js"
import { GroupBodyStream, GroupLimitStream } from "../Group.js"
import { Group } from "../Nodes.js"
import { ParseRegexRecursively } from "../ParserBuilder.js"

export const GroupStream = SingletonWrapperStream(Group)

const PlainGroupLimitStream = GroupLimitStream()

export function HandlePlainGroup(extensions: Regex.Extension[]) {
	const recursiveParser = ParseRegexRecursively(extensions)
	return function (input: IOwnedStream) {
		return [
			GroupStream(),
			GroupBodyStream(),
			recursiveParser,
			PlainGroupLimitStream(),
			PeekStream()
		]
	}
}
