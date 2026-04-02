import type {
	ICellNode,
	INode,
	IRegexCompilerHandler,
	IRegexFactory,
	IValidNodeType
} from "../../../interfaces.js"
import type { Regex } from "../../../objects.js"
import type { TreeStream } from "../../../objects/Stream.js"

export function compileAsInt(
	input: TreeStream<INode>,
	_handler: IRegexCompilerHandler
) {
	return Number((input.curr as ICellNode<string>).value)
}

export function compileAsString(
	input: TreeStream<INode>,
	_handler: IRegexCompilerHandler
) {
	return (input.curr as ICellNode<string>).value
}

export function compileTypeMatch(factory: IRegexFactory) {
	return function (
		input: TreeStream<INode>,
		handler: IRegexCompilerHandler<Regex.Raw | IValidNodeType>
	) {
		input.next() // TypeMatch
		// by Type connascence
		return factory.typeMatch(handler(input) as IValidNodeType)
	}
}
