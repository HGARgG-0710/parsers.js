import type { INode } from "../../interfaces.js"
import type { DepthStream } from "../../objects/Stream.js"
import { next } from "../../utils/Stream.js"
import type { IRegexCompilerHandler } from "./Compiler.js"

export function compileWrapper(
	input: DepthStream<INode>,
	handler: IRegexCompilerHandler
) {
	next(input)
	return handler(input)
}
