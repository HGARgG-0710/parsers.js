import type { INode } from "../../../interfaces.js"
import type { DepthStream } from "../../../objects/Stream.js"
import type { IRegexCompilerHandler } from "../Compiler.js"
import type { IRegexFactory } from "../RegexFactory.js"

export function compileOptional(factory: IRegexFactory) {
	return function (
		input: DepthStream<INode>,
		handler: IRegexCompilerHandler
	) {
		input.next() // Optional
		return factory.optional(handler(input))
	}
}
