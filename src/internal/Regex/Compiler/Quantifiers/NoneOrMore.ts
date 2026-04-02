import type {
	INode,
	IRegexCompilerHandler,
	IRegexFactory
} from "../../../../interfaces.js"
import type { TreeStream } from "../../../../objects/Stream.js"

export function compileNoneOrMore(factory: IRegexFactory) {
	return function (input: TreeStream<INode>, handler: IRegexCompilerHandler) {
		input.next() // NoneOrMore
		return factory.noneOrMore(handler(input))
	}
}
