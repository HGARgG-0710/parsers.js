import type { array } from "@hgargg-0710/one"
import type {
	IOwnedStream,
	IPeekable,
	IStreamChooser
} from "../../interfaces.js"
import { WrapperStream } from "../../samples/Stream.js"
import { HandleCharClass } from "./CharClass.js"
import { Negated } from "./Nodes.js"

const NegationStream = WrapperStream(Negated)

function handleNegation(input: IOwnedStream<string> & IPeekable<string>) {
	input.next() // ^
	return [NegationStream(), HandleCharClass]
}

export const maybeNegation: array.Pairs<string, IStreamChooser> = [
	["^", handleNegation]
]
