import type { IOwnedStream } from "../../../../interfaces.js"
import { CachedTokenStream } from "../../../../samples/Stream.js"
import { Digit } from "../Nodes.js"

const DigitStream = CachedTokenStream(Digit)

export function HandleDigit(input: IOwnedStream<string>) {
	input.next() // d
	return [DigitStream()]
}
