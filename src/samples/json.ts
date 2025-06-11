import { functional } from "@hgargg-0710/one"
import { curr } from "../aliases/Stream.js"
import {
	ConcatStream,
	FiniteStream,
	HandlerStream,
	InterleaveStream,
	LoopStream
} from "../classes/Stream.js"
import type { IOwnedStream, IRecursiveNode, IStream } from "../interfaces.js"

const { trivialCompose } = functional

/**
 * This is a factory for creation of streams
 * that call `JSON.stringify` on each of its
 * `.resource.curr`.
 */
export const JSONStream = HandlerStream<any, string>(
	trivialCompose(JSON.stringify, curr)
)

/**
 * This is a function-factory for `IOwnedStream<string>`,
 * which expects the given `inStream` to return strings
 * with valid JSON objects (ex: `JSONStream(...)`), and
 * which wraps it in opening/closing parts via
 * `wrapperNode.jsonInsertableEmpty()`, returning them
 * at the start and beginning (respectively) of the stream,
 * filling remainder between the two with `inStream` contents
 * separated by ","-characters [each one - a separate element].
 *
 * Useful for in need of, for instance, writing things to
 * a file via an owning `WriterStream`.
 */
export function JSONWrapper(
	wrapperNode: IRecursiveNode,
	inStream: IStream<string>
): IOwnedStream<string> {
	const [pre, post] = wrapperNode.jsonInsertableEmpty()
	return new ConcatStream(
		new FiniteStream(pre),
		new InterleaveStream(inStream, new LoopStream(",")),
		new FiniteStream(post)
	)
}
