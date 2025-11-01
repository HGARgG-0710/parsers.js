import type { INode } from "../../../interfaces.js"
import type { DepthStream } from "../../../objects/Stream.js"
import type { IRegexCompilerHandler } from "../Compiler.js"
import type { IRegexBuilder } from "../RegexBuilder.js"

export function compileNoneOrMore(builder: IRegexBuilder) {
	return function (
		input: DepthStream<INode>,
		handler: IRegexCompilerHandler
	) {
		input.next() // NoneOrMore
		return builder.noneOrMore(handler(input))
	}
}
