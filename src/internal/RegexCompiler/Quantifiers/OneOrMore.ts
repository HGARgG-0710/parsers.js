import type { INode } from "../../../interfaces.js"
import type { DepthStream } from "../../../objects/Stream.js"
import type { IRegexCompilerHandler } from "../Compiler.js"
import type { IRegexBuilder } from "../RegexBuilder.js"

export function compileOneOrMore(regexBuilder: IRegexBuilder) {
	return function (
		input: DepthStream<INode>,
		handler: IRegexCompilerHandler
	) {
		input.next() // OneOrMore
		const catBuilder = regexBuilder.catenation().addItem(handler(input))
		input.next()
		return catBuilder
			.addItem(regexBuilder.noneOrMore(handler(input)))
			.finish()
	}
}
