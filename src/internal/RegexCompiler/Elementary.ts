import type { INode, IRegexBuilder } from "../../interfaces.js"
import type { DepthStream } from "../../objects/Stream.js"
import type { IRegexCompilerHandler } from "./Compiler.js"

// TODO: PROVIDE THE TYPE FOR ELEMENTARIES HERE! [not `any`...]
function compileElementary(makeElementary: (builder: IRegexBuilder) => any) {
	return function (builder: IRegexBuilder) {
		return function (
			_input: DepthStream<INode>,
			_handler: IRegexCompilerHandler
		) {
			return makeElementary(builder)
		}
	}
}

export const compileAnyChar = compileElementary((builder) => builder.anyChar())
export const compileWord = compileElementary((builder) => builder.word())
export const compileDigit = compileElementary((builder) => builder.digit())
export const compileTab = compileElementary((builder) => builder.literal("\t"))
export const compileVTab = compileElementary((builder) => builder.literal("\v"))
export const compileSpace = compileElementary((builder) => builder.space())
export const compileNewline = compileElementary((builder) => builder.newline())
