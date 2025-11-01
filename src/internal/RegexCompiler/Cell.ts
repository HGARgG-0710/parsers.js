import type { ICellNode, INode, IRegexBuilder } from "../../interfaces.js"
import type { DepthStream } from "../../objects/Stream.js"
import type { IRegexCompilerHandler } from "./Compiler.js"

// TODO: ADD the type for nodes - not just `any` here...
function compileCell<T = any>(
	fromCell: (builder: IRegexBuilder, value: T) => any
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
