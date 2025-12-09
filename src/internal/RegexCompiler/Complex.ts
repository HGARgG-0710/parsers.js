import type { INode, IRegexPartBuilder } from "../../interfaces.js"
import type { TreeStream } from "../../objects/Stream.js"
import type { IRegexCompilerHandler } from "src/interfaces/Regex.js"

export function compileComplexPart(getBuilder: () => IRegexPartBuilder) {
	return function (
		input: TreeStream<INode>,
		handler: IRegexCompilerHandler
	) {
		const builder = getBuilder()
		const root = input.curr
		for (let i = 0; i < root.lastChild; ++i) {
			input.next()
			builder.addItem(handler(input))
		}
		return builder.finish()
	}
}
