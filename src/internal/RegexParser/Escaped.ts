import type { array } from "@hgargg-0710/one"
import { TableHandler } from "../../classes.js"
import { BasicHash } from "../../classes/HashMap.js"
import type { IOwnedStream, IStreamChooser } from "../../interfaces.js"
import { ObjectMap } from "../../samples/TerminalMap.js"
import { currMap } from "../../utils/HashMap.js"
import { bail, isError } from "./Errors.js"
import { HandleEscapedLiteral } from "./Escaped/Literal.js"
import { HandleUnicode } from "./Escaped/Unicode.js"

// TODO: add the remainder of the '\...' patterns!
const EscapedHandler = TableHandler(
	new (currMap(BasicHash))(
		ObjectMap(
			{
				u: HandleUnicode
			},
			HandleEscapedLiteral
		)
	)
)

function handleEscaped(input: IOwnedStream<string>) {
	input.next() // \
	const result = EscapedHandler(input)
	if (!isError(result)) return result
	bail(result)
}

export const maybeEscaped: array.Pairs<string, IStreamChooser> = [
	["\\", handleEscaped]
]
