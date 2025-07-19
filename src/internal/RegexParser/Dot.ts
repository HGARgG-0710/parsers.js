import type { array } from "@hgargg-0710/one"
import { TokenNode } from "../../classes/Node.js"
import { SingletonStream } from "../../classes/Stream.js"
import type { IOwnedStream, IStreamChooser } from "../../interfaces.js"

const AnyChar = TokenNode("any-char")
const AnyCharStream = SingletonStream(() => new AnyChar())

function handleDot(input: IOwnedStream<string>) {
	input.next() // .
	return AnyCharStream()
}

export const maybeDot: array.Pairs<string, IStreamChooser> = [[".", handleDot]]
