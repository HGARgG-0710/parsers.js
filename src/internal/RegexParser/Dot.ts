import type { array } from "@hgargg-0710/one"
import { TokenNode } from "../../classes/Node.js"
import type { IOwnedStream, IStreamChooser } from "../../interfaces.js"
import { TokenStream } from "../../samples/Stream.js"

const AnyChar = TokenNode("any-char")
const AnyCharStream = TokenStream(AnyChar)

function handleDot(input: IOwnedStream<string>) {
	input.next() // .
	return [AnyCharStream()]
}

export const maybeDot: array.Pairs<string, IStreamChooser> = [[".", handleDot]]
