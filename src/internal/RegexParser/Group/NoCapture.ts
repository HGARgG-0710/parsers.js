import { type IOwnedStream } from "../../../interfaces.js"
import type { Regex } from "../../../objects.js"
import { skip } from "../../../objects/Error.js"
import { PeekStream } from "../../../objects/Stream.js"
import { SingletonWrapperStream } from "../../../samples/Stream.js"
import { GroupBodyStream, GroupLimitStream } from "../Group.js"
import { NoCaptureGroup } from "../Nodes.js"
import { ParseRegexRecursively } from "../ParserBuilder.js"

const skipEq = skip("=")

const NoCaptureGroupStream = SingletonWrapperStream(NoCaptureGroup)
const NoCaptureGroupLimitStream = GroupLimitStream((input) => {
	skipEq(input) // =
	return 0
})

export function HandleNoCaptureGroup(extensions: Regex.Extension[]) {
	return (input: IOwnedStream<string>) => [
		NoCaptureGroupStream(),
		GroupBodyStream(),
		ParseRegexRecursively(extensions),
		NoCaptureGroupLimitStream(),
		PeekStream()
	]
}
