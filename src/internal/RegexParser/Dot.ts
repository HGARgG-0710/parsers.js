import { TokenNode } from "../../classes/Node.js"
import type { IOwnedStream } from "../../interfaces.js"

const AnyChar = TokenNode("any-char")

function handleDot(input: IOwnedStream<string>) {
	input.next() // .
	return new AnyChar()
}

export const maybeDot = [[".", handleDot]]
