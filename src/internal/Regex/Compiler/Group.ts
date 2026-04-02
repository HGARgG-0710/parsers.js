import type {
	INode,
	IRegexCompilerFunction,
	IRegexCompilerHandler,
	IRegexPartBuilder
} from "../../../interfaces.js"
import type { TreeStream } from "../../../objects/Stream.js"

export function compileGroup(
	input: TreeStream<INode>,
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
	return function (input: TreeStream<INode>, handler: IRegexCompilerHandler) {
		input.next() // skip the wrapper (NoCaptureGroup, IgnoreCaseGroup, etc)
		input.next() // skip the GroupBody
		input.next() // skip the RootRegex

		// expect the `Disjunction`
		return getBuilder().addItem(handleDisjunction(input, handler)).finish()
	}
}
