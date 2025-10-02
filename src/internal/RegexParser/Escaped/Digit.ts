import type { IOwnedStream } from "../../../interfaces.js"
import { TokenStream } from "../../../samples/Stream.js"
import { Digit } from "../Nodes.js"

const DigitStream = TokenStream(Digit)

export function HandleDigit(input: IOwnedStream<string>) {
	input.next() // d
	return DigitStream()
}
