import type { INode } from "../../../interfaces.js"
import type { TreeStream } from "../../../objects/Stream.js"
import type { IRegexCompilerHandler } from "../Compiler.js"
import type { IRegexFactory } from "../RegexFactory.js"

export function compileOptional(factory: IRegexFactory) {
	return function (
		input: TreeStream<INode>,
		handler: IRegexCompilerHandler
	) {
		input.next() // Optional
		return factory.optional(handler(input))
	}
}
