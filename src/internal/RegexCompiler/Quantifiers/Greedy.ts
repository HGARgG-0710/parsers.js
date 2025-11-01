import type { INode } from "../../../interfaces.js"
import type { DepthStream } from "../../../objects/Stream.js"
import type { IRegexCompilerHandler } from "../Compiler.js"
import type { IRegexBuilder } from "../RegexBuilder.js"

export function compileGreedy(builder: IRegexBuilder) {
	return function (
		input: DepthStream<INode>,
		handler: IRegexCompilerHandler
	) {
		input.next() // Greedy
		return builder.greedy(handler(input))
	}
}

export function compileNonGreedy(builder: IRegexBuilder) {
	return function (
		input: DepthStream<INode>,
		handler: IRegexCompilerHandler
	) {
		input.next() // NonGreedy
		return builder.nonGreedy(handler(input))
	}
}
