import type { INode } from "../../../interfaces.js"
import type { TreeStream } from "../../../objects/Stream.js"
import type { IRegexCompilerHandler } from "../Compiler.js"
import type { IRegexFactory } from "../RegexFactory.js"

export function compileNoneOrMore(factory: IRegexFactory) {
	return function (
		input: TreeStream<INode>,
		handler: IRegexCompilerHandler
	) {
		input.next() // NoneOrMore
		return factory.noneOrMore(handler(input))
	}
}
