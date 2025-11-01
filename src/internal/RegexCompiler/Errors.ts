import type { INode } from "../../interfaces.js"
import { ConstructorError } from "../../objects/Error.js"
import type { DepthStream } from "../../objects/Stream.js"
import type { IRegexCompilerHandler } from "./Compiler.js"

class RegexCompilationError extends ConstructorError {
	constructor(item: INode) {
		super(
			`Error compiling the item: ${item.debugPrint()} to a Regex object`
		)
	}
}

export function compilerBuilderErrHandler(
	input: DepthStream<INode>,
	_handler: IRegexCompilerHandler
) {
	throw new RegexCompilationError(input.curr)
}
