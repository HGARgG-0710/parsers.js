import type {
	IOwnedStream,
	IPeekable,
	IRawStreamArray
} from "../../interfaces.js"
import { unexpected } from "../../objects/Error.js"
import { SingletonWrapperStream } from "../../samples/Stream.js"
import { HandleMaybeBoundaryClass } from "./Class/BoundaryClass.js"
import { HandleCharClass } from "./Class/CharClass.js"
import { CurrCharHandler } from "./CurrCharHandler.js"
import { Negated } from "./Nodes.js"

const NegationStream = SingletonWrapperStream(Negated)

const NegatedHandler = CurrCharHandler<IRawStreamArray>(
	{
		"[": HandleCharClass,
		"\\": HandleMaybeBoundaryClass
	},
	(input: IOwnedStream<string>) => unexpected(input)
)

function handleNegation(input: IOwnedStream<string> & IPeekable<string>) {
	input.next() // ^
	return [NegationStream(), NegatedHandler]
}

export const maybeNegation = {
	"^": handleNegation
}
