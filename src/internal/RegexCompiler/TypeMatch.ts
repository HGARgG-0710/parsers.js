import type { ICellNode, INode, IValidNodeType } from "../../interfaces.js"
import type { DepthStream } from "../../objects/Stream.js"
import type { IRegexCompilerHandler } from "./Compiler.js"
import type { IRegexFactory } from "./RegexFactory.js"

export function compileAsInt(
	input: DepthStream<INode>,
	_handler: IRegexCompilerHandler
) {
	return Number((input.curr as ICellNode<string>).value)
}

export function compileAsString(
	input: DepthStream<INode>,
	_handler: IRegexCompilerHandler
) {
	return (input.curr as ICellNode<string>).value
}

export function compileTypeMatch(factory: IRegexFactory) {
	return function (
		input: DepthStream<INode>,
		handler: IRegexCompilerHandler<IValidNodeType>
	) {
		input.next() // TypeMatch
		return factory.typeMatch(handler(input))
	}
}
