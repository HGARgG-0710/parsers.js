import { TokenNode } from "../../../objects/Node.js"
import type { IOwnedStream } from "../../../interfaces.js"
import { TokenStream } from "../../../samples/Stream.js"

const Digit = TokenNode("digit")
const DigitStream = TokenStream(Digit)

export function HandleDigit(input: IOwnedStream<string>) {
	input.next() // d
	return DigitStream()
}
