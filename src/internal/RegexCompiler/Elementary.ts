import type { INode } from "../../interfaces.js"
import type { Regex } from "../../objects.js"
import type { DepthStream } from "../../objects/Stream.js"
import type { IRegexCompilerHandler } from "./Compiler.js"
import type { IRegexBuilder } from "./RegexBuilder.js"

function compileElementary(
	makeElementary: (builder: IRegexBuilder) => Regex.Raw
) {
	return function (builder: IRegexBuilder) {
		return function (
			_input: DepthStream<INode>,
			_handler: IRegexCompilerHandler
		) {
			return makeElementary(builder)
		}
	}
}

export const compileAnyChar = compileElementary((builder) => builder.anything())
export const compileWord = compileElementary((builder) => builder.word())
export const compileDigit = compileElementary((builder) => builder.digit())
export const compileTab = compileElementary((builder) => builder.literal("\t"))
export const compileVTab = compileElementary((builder) => builder.literal("\v"))
export const compileSpace = compileElementary((builder) => builder.space())
export const compileNewline = compileElementary((builder) => builder.newline())
