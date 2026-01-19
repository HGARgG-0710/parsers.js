import type {
	IOwnedStream,
	IPeekable,
	IRawStreamArray
} from "../../../interfaces.js"
import { unexpected } from "../../../objects/Error.js"
import { SingletonWrapperStream } from "../../../samples/Stream.js"
import { HandleBoundaryClass } from "./Class/BoundaryClass.js"
import { HandleCharClass } from "./Class/CharClass.js"
import { Negated } from "./Nodes.js"
import { CurrCharHandler } from "./Utils/CurrCharHandler.js"

const NegationStream = SingletonWrapperStream(Negated)

const NegatedHandler = CurrCharHandler<IRawStreamArray>(
	{
		"[": HandleCharClass,
		"\\": HandleNegatable
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

const handleNegatableEscaped = CurrCharHandler({
	b: HandleBoundaryClass
})

function HandleNegatable(input: IOwnedStream<string>) {
	input.next() // \
	return handleNegatableEscaped(input)
}
