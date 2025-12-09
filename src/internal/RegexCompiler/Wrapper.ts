import type { INode } from "../../interfaces.js"
import type { TreeStream } from "../../objects/Stream.js"
import { next } from "../../utils/Stream.js"
import type { IRegexCompilerHandler } from "src/interfaces/Regex.js"

export function compileWrapper(
	input: TreeStream<INode>,
	handler: IRegexCompilerHandler
) {
	next(input)
	return handler(input)
}
