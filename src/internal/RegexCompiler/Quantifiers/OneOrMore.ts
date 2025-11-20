import type { INode } from "../../../interfaces.js"
import type { TreeStream } from "../../../objects/Stream.js"
import type { IRegexCompilerHandler } from "../Compiler.js"
import type { IRegexFactory } from "../RegexFactory.js"

export function compileOneOrMore(regexBuilder: IRegexFactory) {
	return function (
		input: TreeStream<INode>,
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
