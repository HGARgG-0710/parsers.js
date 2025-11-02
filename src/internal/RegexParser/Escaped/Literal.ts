import type { IOwnedStream } from "../../../interfaces.js"
import { allow } from "../../../objects/Error.js"
import {
	DefaultChooser,
	SingletonWrapperStream
} from "../../../samples/Stream.js"
import { EscapedLiteral } from "../Nodes.js"

const EscapedLiteralStream = SingletonWrapperStream(EscapedLiteral)
const EscapedLiteralHandler = DefaultChooser(EscapedLiteralStream)

// TODO: MAKE SURE nothing is missing (and nothing is excessive here...)
const allowEscapeLiteral = allow(
	"^",
	"\\",
	"=",
	"{",
	"}",
	"+",
	"*",
	".",
	"?",
	"[",
	"]",
	"(",
	")", 
	"#"
)

export function HandleEscapedLiteral(input: IOwnedStream<string>) {
	allowEscapeLiteral(input)
	return EscapedLiteralHandler()
}
