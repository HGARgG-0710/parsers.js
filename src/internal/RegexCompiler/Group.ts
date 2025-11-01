import type { INode, IRegexPartBuilder } from "../../interfaces.js";
import type { DepthStream } from "../../objects/Stream.js";
import type { IRegexCompilerHandler, IRegexCompilerFunction } from "./Compiler.js";


export function compileGroup(
	input: DepthStream<INode>,
	handler: IRegexCompilerHandler
) {
	input.next() // Group
	input.next() // GroupBody
	return handler(input) // at RootNode
}

export function compileRecursiveChoiceWrapper(
	getBuilder: () => IRegexPartBuilder,
	handleDisjunction: IRegexCompilerFunction
) {
	return function (
		input: DepthStream<INode>,
		handler: IRegexCompilerHandler
	) {
		input.next() // skip the wrapper (LookaheadGroup, IgnoreCaseGroup, etc)
		input.next() // skip the GroupBody
		input.next() // skip the RootRegex



		// expect the `Disjunction`
		const builder = getBuilder()
		builder.addItem(handleDisjunction(input, handler))
		return builder.finish()
	}
}
