import type { INode, IRegexBuilder } from "../../../interfaces.js"
import type { DepthStream } from "../../../objects/Stream.js"
import type { IRegexCompilerHandler } from "../Compiler.js"

export function compileOneOrMore(regexBuilder: IRegexBuilder) {
	return function (
		input: DepthStream<INode>,
		handler: IRegexCompilerHandler
	) {
		input.next() // OneOrMore
		const catBuilder = regexBuilder.catenation()
		catBuilder.addItem(handler(input))
		input.next()
		catBuilder.addItem(regexBuilder.noneOrMore(handler(input)))
		return catBuilder.finish()
	}
}
