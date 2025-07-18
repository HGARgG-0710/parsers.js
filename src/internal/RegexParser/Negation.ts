import type { array } from "@hgargg-0710/one"
import { SingleChildNode } from "../../classes/Node.js"
import { SingletonStream } from "../../classes/Stream.js"
import type { IOwnedStream, IStreamChooser } from "../../interfaces.js"

const Negated = SingleChildNode("negated")
const NegationStream = SingletonStream(
	(input: IOwnedStream) => new Negated(input.curr)
)

function handleNegation(input: IOwnedStream<string>) {
	input.next() // ^
	// TODO: HANDLE deeply: return (as a second item) the "ParseRegex", or smth - the GLOBAL expression-function;
	return [NegationStream()]
}

export const maybeNegation: array.Pairs<string, IStreamChooser> = [
	["^", handleNegation]
]
