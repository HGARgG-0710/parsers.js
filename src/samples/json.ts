import {
	ConcatStream,
	FiniteStream,
	HandlerStream,
	InterleaveStream,
	LoopStream
} from "../classes/Stream.js"
import type { IRecursiveNode, IStream } from "../interfaces.js"

export const JSONStream = HandlerStream(JSON.stringify)

export function JSONWrapper(wrapperNode: IRecursiveNode, inStream: IStream) {
	const [pre, post] = wrapperNode.jsonInsertableEmpty()
	return new ConcatStream(
		new FiniteStream(pre),
		new InterleaveStream(inStream, new LoopStream(",")),
		new FiniteStream(post)
	)
}
