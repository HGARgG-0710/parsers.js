import type { IOwnedStream } from "../../../interfaces.js"
import { SingletonWrapperStream } from "../../../samples/Stream.js"
import { GroupBodyStream, GroupLimitStream } from "../Group.js"
import { NoCaptureGroup } from "../Nodes.js"
import { ParseRegexRecursively } from "../Parser.js"

const NoCaptureGroupStream = SingletonWrapperStream(NoCaptureGroup)

export function HandleNoCaptureGroup(input: IOwnedStream<string>) {
	input.next() // =
	return [
		NoCaptureGroupStream(),
		GroupBodyStream(),
		ParseRegexRecursively,
		GroupLimitStream()
	]
}
