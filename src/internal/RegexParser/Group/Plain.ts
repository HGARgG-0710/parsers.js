import type { IRawStreamArray } from "../../../interfaces.js"
import { Parametrized, type Regex } from "../../../objects.js"
import { PeekStream } from "../../../objects/Stream.js"
import { SingletonWrapperStream } from "../../../samples/Stream.js"
import { GroupBodyStream, GroupLimitStream } from "../Group.js"
import { Group } from "../Nodes.js"
import { ParseRegexRecursively } from "../ParserBuilder.js"

export const GroupStream = SingletonWrapperStream(Group)

const PlainGroupLimitStream = GroupLimitStream()

export const HandlePlainGroup = new Parametrized(
	(extensions: Regex.Extension[]) => (): IRawStreamArray =>
		[
			GroupStream(),
			GroupBodyStream(),
			ParseRegexRecursively.for(extensions),
			PlainGroupLimitStream(),
			PeekStream()
		]
)
