import { SingleChildNode } from "../../../classes/Node.js"
import { SingletonStream } from "../../../classes/Stream.js"
import { GroupBodyStream, GroupLimitStream } from "../Group.js"

const CaptureGroup = SingleChildNode("capture-group")
const CaptureGroupStream = SingletonStream(
	(input) => new CaptureGroup(input.curr)
)

export function HandleCaptureGroup() {
	return [
		CaptureGroupStream(),
		GroupBodyStream(),
		,
		// TODO: THIRD ITEM - the "main" chooser! ADD IT (this is the recursion spot)
		GroupLimitStream()
	]
}
