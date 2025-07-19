import type { array } from "@hgargg-0710/one"
import { TableHandler } from "../../classes.js"
import type { IOwnedStream, IStreamChooser } from "../../interfaces.js"
import { ObjectMap } from "../../samples/TerminalMap.js"
import { BasicCurrMap } from "../RegexParser.js"
import { checkMaybeError } from "./Errors.js"
import { HandleDigit } from "./Escaped/Digit.js"
import { HandleEscapedLiteral } from "./Escaped/Literal.js"
import { HandleNewline } from "./Escaped/Newline.js"
import { HandleSpace } from "./Escaped/Space.js"
import { HandleTab } from "./Escaped/Tab.js"
import { HandleUnicode } from "./Escaped/Unicode.js"
import { HandleVerticalTab } from "./Escaped/Vtab.js"
import { HandleWord } from "./Escaped/Word.js"

export const BaseEscapedHandler = TableHandler(
	new BasicCurrMap(
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

function handleEscaped(input: IOwnedStream<string>) {
	input.next() // \
	const result = BaseEscapedHandler(input)
	checkMaybeError(result)
	return result
}

export const maybeEscaped: array.Pairs<string, IStreamChooser> = [
	["\\", handleEscaped]
]
