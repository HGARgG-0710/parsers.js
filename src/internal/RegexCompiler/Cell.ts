import type { ICellNode, INode } from "../../interfaces.js"
import type { Regex } from "../../objects.js"
import type { DepthStream } from "../../objects/Stream.js"
import type { IRegexCompilerHandler } from "./Compiler.js"
import type { IRegexBuilder } from "./RegexBuilder.js"

function compileCell<T = any>(
	fromCell: (builder: IRegexBuilder, value: T) => Regex.Raw
) {
	return function (builder: IRegexBuilder) {
		return function (
			input: DepthStream<INode>,
			_handler: IRegexCompilerHandler
		) {
			return fromCell(builder, (input.curr as ICellNode<T>).value)
		}
	}
}

export const compileUnicodeChar = compileCell<string>((builder, hex) =>
	builder.unicodeChar(hex)
)

export const compileLiteral = compileCell<string>((builder, value) =>
	builder.literal(value)
)
