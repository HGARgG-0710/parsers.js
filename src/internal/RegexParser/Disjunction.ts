import type { INode, IOwnedStream, IRawStreamArray } from "../../interfaces.js"
import { ArrayBuilder } from "../../objects.js"
import { LimitStream, SingleNodeStream } from "../../objects/Stream.js"
import { CollectionStream } from "../../samples/Stream.js"
import { consumable, consumeSingletonRevivables } from "../../utils/Stream.js"
import { Disjunct, Disjunction, Temp } from "./Nodes.js"

const isCurrPipe = (input: IOwnedStream<INode>) => !Temp.Pipe.is(input.curr)

const PipeLimitStream = LimitStream(isCurrPipe)

// * note: this is NOT a bug, since accepting empty strings MAKES NO SENSE for this specific grammar,
// a sequence of characters that is matched from the given '.curr'-point MUST be non-zero in length
function PipeLimitChooser(input: IOwnedStream<INode>) {
	while (isCurrPipe(input)) input.next()
	return [PipeLimitStream()]
}

const withDisjunctBuilder = consumable<
	INode,
	Iterable<INode>,
	ArrayBuilder<INode>
>(new ArrayBuilder<INode>())

const DisjunctStream = CollectionStream(Disjunct, withDisjunctBuilder)

class DisjunctionStream extends SingleNodeStream<INode> {
	setResource(resource: IOwnedStream): void {
		this.setResource(resource)
		this.curr = consumeSingletonRevivables(this, new Disjunction())
	}
}

export function ProduceDisjunction(): IRawStreamArray {
	return [new DisjunctionStream(), DisjunctStream(), PipeLimitChooser]
}
