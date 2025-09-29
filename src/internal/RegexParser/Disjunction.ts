import { RetainedArray } from "../../classes.js"
import { RecursiveNode } from "../../classes/Node.js"
import {
	LimitStream,
	NodeStream,
	SingletonStream
} from "../../classes/Stream.js"
import type {
	ICollectionNode,
	INode,
	IOwnedStream,
	IRawStreamArray
} from "../../interfaces.js"
import { consumable } from "../../utils/Stream.js"
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
	RetainedArray<INode<string>>
>(new RetainedArray<INode<string>>())

const Disjunct = RecursiveNode("disjunct")
const DisjunctStream = SingletonStream(
	(input: IOwnedStream<INode<string>> & Iterable<INode<string>>) =>
		new Disjunct(withDisjunctBuilder(input).get() as INode<string>[])
)

const Disjunction = RecursiveNode("disjunction")

class DisjunctionStream extends NodeStream<INode<string>> {
	private disjunct: ICollectionNode<string>

	setResource(resource: IOwnedStream): void {
		this.setResource(resource)
		this.disjunct = new Disjunction([])

		let didLastRevive = true
		while (didLastRevive) {
			this.disjunct.push(this.resource!.curr)
			this.resource!.next() // child dies - a `SingletonStream`
			didLastRevive = this.reviveChild() // revive - same child, relies on a chooser
		}
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
