import { TableHandler } from "../../../classes.js"
import { CurrentHash } from "../../../classes/HashMap.js"
import { ContentNode } from "../../../classes/Node.js"
import { DefaultChooser, WrapperStream } from "../../../samples/Stream.js"
import { ObjectMap } from "../../../samples/TerminalMap.js"
import { ErrorCode } from "../Errors.js"

const EscapedLiteral = ContentNode<string, string>("escaped-literal")
const EscapedLiteralStream = WrapperStream(EscapedLiteral)
const EscapedLiteralHandler = DefaultChooser(EscapedLiteralStream)

export const HandleEscapedLiteral = TableHandler(
	new CurrentHash(
		ObjectMap(
			{
				"^": EscapedLiteralHandler,
				"\\": EscapedLiteralHandler,
				"=": EscapedLiteralHandler,
				"{": EscapedLiteralHandler,
				"}": EscapedLiteralHandler,
				"+": EscapedLiteralHandler,
				"*": EscapedLiteralHandler,
				".": EscapedLiteralHandler,
				"?": EscapedLiteralHandler,
				"[": EscapedLiteralHandler,
				"]": EscapedLiteralHandler
			},
			ErrorCode.InvalidEscapedChar
		)
	)
)
