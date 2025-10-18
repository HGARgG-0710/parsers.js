import type { array } from "@hgargg-0710/one"
import type {
	IOwnedStream,
	IPeekable,
	IStreamChooser
} from "../../interfaces.js"
import { expect } from "../../objects/Error.js"
import { SingletonWrapperStream } from "../../samples/Stream.js"
import { HandleCharClass } from "./CharClass.js"
import { Negated } from "./Nodes.js"

const NegationStream = SingletonWrapperStream(Negated)
const expectCharClassStart = expect("[")

function handleNegation(input: IOwnedStream<string> & IPeekable<string>) {
	input.next() // ^
	expectCharClassStart(input)
	return [NegationStream(), HandleCharClass]
}

export const maybeNegation: array.Pairs<string, IStreamChooser> = [
	["^", handleNegation]
]
