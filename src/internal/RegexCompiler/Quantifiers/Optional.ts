import type { INode, IRegexFactory } from "../../../interfaces.js"
import type { TreeStream } from "../../../objects/Stream.js"
import type { IRegexCompilerHandler } from "src/interfaces/Regex.js"

export function compileOptional(factory: IRegexFactory) {
	return function (input: TreeStream<INode>, handler: IRegexCompilerHandler) {
		input.next() // Optional
		return factory.optional(handler(input))
	}
}
