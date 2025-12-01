import { functional } from "@hgargg-0710/one"
import type { INode, IOwnedStream, IRecursiveNode } from "../interfaces.js"
import { HandlerStream } from "../objects/Stream.js"
import { curr } from "../utils/Stream.js"
import { DelimitedStream } from "./Stream.js"

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
export const JSONWrapper = DelimitedStream<string, IRecursiveNode>(
	() => ",",
	(node) => node.jsonInsertableEmpty().map((x) => [x]) as [string[], string[]]
)

// ! PRE-DOC [important]: this is purely a convinience class.
export class JSONGenerator {
	fromStream(stream: IOwnedStream<INode>) {
		return JSONWrapper(this.wrapperElement, JSONStream(stream))
	}

	fromNode(node: INode) {
		return JSON.stringify(node)
	}

	constructor(private readonly wrapperElement: IRecursiveNode) {}
}
