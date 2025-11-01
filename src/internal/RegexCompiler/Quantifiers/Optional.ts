import type { IRegexBuilder, INode } from "../../../interfaces.js";
import type { DepthStream } from "../../../objects/Stream.js";
import type { IRegexCompilerHandler } from "../Compiler.js";


export function compileOptional(builder: IRegexBuilder) {
	return function (
		input: DepthStream<INode>,
		handler: IRegexCompilerHandler
	) {
		input.next() // Optional
		return builder.optional(handler(input))
	}
}
