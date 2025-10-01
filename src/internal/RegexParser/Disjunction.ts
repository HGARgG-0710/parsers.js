import { ArrayBuilder } from "../../classes.js"
import { RecursiveNode } from "../../classes/Node.js"
import { LimitStream, NodeStream } from "../../classes/Stream.js"
import type { INode, IOwnedStream, IRawStreamArray } from "../../interfaces.js"
import { CollectionStream } from "../../samples/Stream.js"
import { consumable, consumeSingletonRevivables } from "../../utils/Stream.js"
import { Pipe } from "./Pipe.js"

const isCurrPipe = (input: IOwnedStream<INode<string>>) => !Pipe.is(input.curr)

const PipeLimitStream = LimitStream(isCurrPipe)

// * note: this is NOT a bug, since accepting empty strings MAKES NO SENSE for this specific grammar,
// a sequence of characters that is matched from the given '.curr'-point MUST be non-zero in length
function PipeLimitChooser(input: IOwnedStream<INode<string>>) {
	while (isCurrPipe(input)) input.next()
	return [PipeLimitStream()]
}

const withDisjunctBuilder = consumable<
	INode<string>,
	Iterable<INode<string>>,
	ArrayBuilder<INode<string>>
>(new ArrayBuilder<INode<string>>())

const Disjunct = RecursiveNode("disjunct")
const DisjunctStream = CollectionStream(Disjunct, withDisjunctBuilder)

const Disjunction = RecursiveNode("disjunction")

class DisjunctionStream extends NodeStream<INode<string>> {
	setResource(resource: IOwnedStream): void {
		this.setResource(resource)
		this.curr = consumeSingletonRevivables(this, new Disjunction([]))
	}

	isCurrEnd(): boolean {
		return true
	}

	next(): void {
		this.endStream()
	}
}

export function ProduceDisjunction(): IRawStreamArray {
	return [new DisjunctionStream(), DisjunctStream(), PipeLimitChooser]
}
