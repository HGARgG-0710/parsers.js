import type { INode, IRegexCompilerHandler } from "../../../interfaces.js"
import type { TreeStream } from "../../../objects/Stream.js"
import { next } from "../../../utils/Stream.js"

export function compileWrapper(
	input: TreeStream<INode>,
	handler: IRegexCompilerHandler
) {
	next(input)
	return handler(input)
}
