import { RetainedArray } from "../../classes.js"
import { RecursiveNode } from "../../classes/Node.js"
import { FilterStream, SingletonStream } from "../../classes/Stream.js"
import type { INode, IOwnedStream } from "../../interfaces.js"
import { consume } from "../../utils/Stream.js"
import { Pipe } from "./Pipe.js"

const disjunctionBuilder = new RetainedArray<INode<string>>()

const Disjunction = RecursiveNode("disjunction")
const DisjunctionStream = SingletonStream(
	(input: IOwnedStream<INode<string>> & Iterable<INode<string>>) => {
		disjunctionBuilder.clear()
		return new Disjunction(
			consume(input, disjunctionBuilder).get() as INode<string>[]
		)
	}
)

const PipeFilterStream = FilterStream(
	(input: IOwnedStream<INode<string>>) => !Pipe.is(input.curr)
)

export function ProduceDisjunction() {
	return [DisjunctionStream(), PipeFilterStream()]
}
