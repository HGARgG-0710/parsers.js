import type {
	INode,
	IRegexBuilder,
	IRegexPartBuilder
} from "../../interfaces.js"
import type { DepthStream } from "../../objects/Stream.js"
import { type IRegexCompilerHandler } from "./Compiler.js"
import { compileComplexPart } from "./Complex.js"

export function compileClassRange(builder: IRegexBuilder) {
	return function (
		input: DepthStream<INode>,
		handler: IRegexCompilerHandler
	) {
		input.next() // ClassRange
		const from = handler(input)
		input.next() // ClassUnit
		const to = handler(input)
		return builder.charRange(from, to)
	}
}

export function compileNegated(
	getNegCharClassBuilder: () => IRegexPartBuilder
) {
	const negCharClassCompiler = compileComplexPart(getNegCharClassBuilder)
	return function (
		input: DepthStream<INode>,
		handler: IRegexCompilerHandler
	) {
		input.next() // Negated
		return negCharClassCompiler(input, handler)
	}
}
