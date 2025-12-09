import type { INode } from "../../interfaces.js"
import { ConstructorError } from "../../objects/Error.js"
import type { TreeStream } from "../../objects/Stream.js"
import type { IRegexCompilerHandler } from "src/interfaces/Regex.js"

class RegexCompilationError extends ConstructorError {
	constructor(item: INode) {
		super(
			`Error compiling the item: ${item.debugPrint()} to a Regex object`
		)
	}
}

export function compilerBuilderErrHandler<T = any>(
	input: TreeStream<INode>,
	_handler: IRegexCompilerHandler<T>
) {
	throw new RegexCompilationError(input.curr)
}
