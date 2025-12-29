import type { IRegexCompilerHandler } from "src/interfaces/Regex.js"
import type { ICellNode, INode, IRegexFactory } from "../../../interfaces.js"
import type { Regex } from "../../../objects.js"
import type { TreeStream } from "../../../objects/Stream.js"

function compileCell<T = any, Out extends Regex.Raw = Regex.Raw>(
	fromCell: (factory: IRegexFactory, value: T) => Out
) {
	return function (factory: IRegexFactory) {
		return function (
			input: TreeStream<INode>,
			_handler: IRegexCompilerHandler
		) {
			return fromCell(factory, (input.curr as ICellNode<T>).value)
		}
	}
}

export const compileUnicodeChar = compileCell<string, Regex.Raw.Char>(
	(factory, hex) => factory.unicodeChar(hex)
)

export const compileLiteral = compileCell<string, Regex.Raw.Char>(
	(factory, value) => factory.literal(value)
)
