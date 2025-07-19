import { TokenNode } from "../../../classes/Node.js"
import { SingletonStream } from "../../../classes/Stream.js"
import type { IOwnedStream } from "../../../interfaces.js"

const Digit = TokenNode("digit")
const DigitStream = SingletonStream(() => new Digit())

export function HandleDigit(input: IOwnedStream<string>) {
	input.next() // d
	return DigitStream()
}
