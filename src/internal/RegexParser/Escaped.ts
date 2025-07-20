import type { array } from "@hgargg-0710/one"
import { TableHandler } from "../../classes.js"
import { CurrentHash } from "../../classes/HashMap.js"
import type { IOwnedStream, IStreamChooser } from "../../interfaces.js"
import { ObjectMap } from "../../samples/TerminalMap.js"
import { checkMaybeError } from "./Errors.js"
import { HandleDigit } from "./Escaped/Digit.js"
import { HandleEscapedLiteral } from "./Escaped/Literal.js"
import { HandleNewline } from "./Escaped/Newline.js"
import { HandleSpace } from "./Escaped/Space.js"
import { HandleTab } from "./Escaped/Tab.js"
import { HandleUnicode } from "./Escaped/Unicode.js"
import { HandleVerticalTab } from "./Escaped/Vtab.js"
import { HandleWord } from "./Escaped/Word.js"

const BaseEscapedHandler = TableHandler(
	new CurrentHash(
		ObjectMap(
			{
				w: HandleWord,
				d: HandleDigit,
				s: HandleSpace,
				u: HandleUnicode,
				n: HandleNewline,
				t: HandleTab,
				v: HandleVerticalTab
			},
			HandleEscapedLiteral
		)
	)
)

export function HandleEscaped(input: IOwnedStream<string>) {
	input.next() // \
	const result = BaseEscapedHandler(input)
	checkMaybeError(result)
	return result
}

export const maybeEscaped: array.Pairs<string, IStreamChooser> = [
	["\\", HandleEscaped]
]
