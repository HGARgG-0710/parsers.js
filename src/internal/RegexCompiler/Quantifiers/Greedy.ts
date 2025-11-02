import type { INode } from "../../../interfaces.js"
import type { DepthStream } from "../../../objects/Stream.js"
import type { IRegexCompilerHandler } from "../Compiler.js"
import type { IRegexFactory } from "../RegexFactory.js"

export function compileGreedy(factory: IRegexFactory) {
	return function (
		input: DepthStream<INode>,
		handler: IRegexCompilerHandler
	) {
		input.next() // Greedy
		return factory.greedy(handler(input))
	}
}

export function compileNonGreedy(factory: IRegexFactory) {
	return function (
		input: DepthStream<INode>,
		handler: IRegexCompilerHandler
	) {
		input.next() // NonGreedy
		return factory.nonGreedy(handler(input))
	}
}
