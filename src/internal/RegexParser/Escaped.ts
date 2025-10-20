import type { array } from "@hgargg-0710/one"
import type {
	ICommonStream,
	INode,
	IOwnedStream,
	IStreamChooser
} from "../../interfaces.js"
import { TableHandler } from "../../objects.js"
import { CurrentHash } from "../../objects/HashMap.js"
import { ObjectMap } from "../../samples/TerminalMap.js"
import { HandleDigit } from "./Escaped/Digit.js"
import { HandleEscapedLiteral } from "./Escaped/Literal.js"
import { HandleNewline } from "./Escaped/Newline.js"
import { HandleSpace } from "./Escaped/Space.js"
import { HandleTab } from "./Escaped/Tab.js"
import { HandleUnicode } from "./Escaped/Unicode.js"
import { HandleVTab } from "./Escaped/Vtab.js"
import { HandleWord } from "./Escaped/Word.js"

const BaseEscapedHandler = TableHandler<
	IOwnedStream<string>,
	ICommonStream<INode>
>(
	new CurrentHash(
		ObjectMap(
			{
				w: HandleWord,
				d: HandleDigit,
				s: HandleSpace,
				u: HandleUnicode,
				n: HandleNewline,
				t: HandleTab,
				v: HandleVTab
			},
			HandleEscapedLiteral
		)
	)
)

export function HandleEscaped(input: IOwnedStream<string>) {
	input.next() // \
	return [BaseEscapedHandler(input)]
}

export const maybeEscaped: array.Pairs<string, IStreamChooser> = [
	["\\", HandleEscaped]
]
