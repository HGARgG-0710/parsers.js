import type { INode } from "../../../interfaces.js"
import type { DepthStream } from "../../../objects/Stream.js"
import type { IRegexCompilerHandler } from "../Compiler.js"
import type { IRegexBuilder } from "../RegexBuilder.js"

export function compileOptional(builder: IRegexBuilder) {
	return function (
		input: DepthStream<INode>,
		handler: IRegexCompilerHandler
	) {
		input.next() // Optional
		return builder.optional(handler(input))
	}
}
