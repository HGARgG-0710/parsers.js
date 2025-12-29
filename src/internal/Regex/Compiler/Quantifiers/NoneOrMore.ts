import type { INode, IRegexFactory } from "../../../../interfaces.js"
import type { TreeStream } from "../../../../objects/Stream.js"
import type { IRegexCompilerHandler } from "src/interfaces/Regex.js"

export function compileNoneOrMore(factory: IRegexFactory) {
	return function (input: TreeStream<INode>, handler: IRegexCompilerHandler) {
		input.next() // NoneOrMore
		return factory.noneOrMore(handler(input))
	}
}
