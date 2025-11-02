import type { INode, IRegexPartBuilder } from "../../interfaces.js"
import type { DepthStream } from "../../objects/Stream.js"
import type {
	IRegexCompilerFunction,
	IRegexCompilerHandler
} from "./Compiler.js"

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
		input.next() // skip the wrapper (NoCaptureGroup, IgnoreCaseGroup, etc)
		input.next() // skip the GroupBody
		input.next() // skip the RootRegex

		// expect the `Disjunction`
		return getBuilder().addItem(handleDisjunction(input, handler)).finish()
	}
}
