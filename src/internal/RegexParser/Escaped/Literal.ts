import { TableHandler } from "../../../classes.js"
import { ContentNode } from "../../../classes/Node.js"
import { SingletonStream } from "../../../classes/Stream.js"
import type { IOwnedStream } from "../../../interfaces.js"
import { ObjectMap } from "../../../samples/TerminalMap.js"
import { BasicCurrMap } from "../../RegexParser.js"
import { ErrorCode } from "../Errors.js"

const EscapedLiteral = ContentNode<string, string>("escaped-literal")
const EscapedLiteralStream = SingletonStream(
	(input: IOwnedStream<string>) => new EscapedLiteral(input.curr)
)

function EscapedLiteralHandler() {
	return [EscapedLiteralStream()]
}

export const HandleEscapedLiteral = TableHandler(
	new BasicCurrMap(
		ObjectMap(
			{
				"^": EscapedLiteralHandler,
				"\\": EscapedLiteralHandler,
				"{": EscapedLiteralHandler,
				"}": EscapedLiteralHandler,
				"+": EscapedLiteralHandler,
				"*": EscapedLiteralHandler,
				"?": EscapedLiteralHandler,
				"[": EscapedLiteralHandler,
				"]": EscapedLiteralHandler
			},
			ErrorCode.InvalidEscapedChar
		)
	)
)
