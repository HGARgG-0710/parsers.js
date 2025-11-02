import type { INode } from "../../interfaces.js"
import type { Regex } from "../../objects.js"
import type { DepthStream } from "../../objects/Stream.js"
import type { IRegexCompilerHandler } from "./Compiler.js"
import type { IRegexFactory } from "./RegexFactory.js"

function compileElementary<Out extends Regex.Raw = Regex.Raw>(
	makeElementary: (factory: IRegexFactory) => Out
) {
	return function (factory: IRegexFactory) {
		return function (
			_input: DepthStream<INode>,
			_handler: IRegexCompilerHandler
		) {
			return makeElementary(factory)
		}
	}
}

export const compileAnyChar = compileElementary((factory) => factory.anything())
export const compileWord = compileElementary((factory) => factory.word())
export const compileDigit = compileElementary((factory) => factory.digit())
export const compileTab = compileElementary((factory) => factory.literal("\t"))
export const compileVTab = compileElementary((factory) => factory.literal("\v"))
export const compileSpace = compileElementary((factory) => factory.space())
export const compileNewline = compileElementary((factory) => factory.newline())
export const compileFormFeed = compileElementary((factory) =>
	factory.literal("\f")
)
