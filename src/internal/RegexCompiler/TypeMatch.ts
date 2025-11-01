import type { ICellNode, INode } from "../../interfaces.js"
import type { DepthStream } from "../../objects/Stream.js"
import type { IRegexCompilerHandler } from "./Compiler.js"
import type { IRegexBuilder } from "./RegexBuilder.js"

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

export function compileTypeMatch(builder: IRegexBuilder) {
	return function (
		input: DepthStream<INode>,
		handler: IRegexCompilerHandler
	) {
		input.next() // TypeMatch
		return builder.typeMatch(handler(input))
	}
}
