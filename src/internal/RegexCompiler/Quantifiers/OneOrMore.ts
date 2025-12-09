import type { INode, IRegexFactory } from "../../../interfaces.js"
import type { TreeStream } from "../../../objects/Stream.js"
import type { IRegexCompilerHandler } from "src/interfaces/Regex.js"

export function compileOneOrMore(regexBuilder: IRegexFactory) {
	return function (input: TreeStream<INode>, handler: IRegexCompilerHandler) {
		input.next() // OneOrMore
		const catBuilder = regexBuilder.catenation().addItem(handler(input))
		input.next()
		return catBuilder
			.addItem(regexBuilder.noneOrMore(handler(input)))
			.finish()
	}
}
