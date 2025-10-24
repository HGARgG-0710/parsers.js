import type { array } from "@hgargg-0710/one"
import type {
	INode,
	INodeType,
	IOwnedStream,
	IStreamChooser
} from "../../../interfaces.js"
import { SingleChildNode } from "../../../objects/Node.js"
import { SingletonStream } from "../../../objects/Stream.js"
import { next } from "../../../utils/Stream.js"
import { Temp } from "../Nodes.js"

const NonGreedyPlus = SingleChildNode("non-greedy-plus", "NonGreedyPlus")
const GreedyPlus = SingleChildNode("greedy-plus", "GreedyPlus")

function handlePlus(input: IOwnedStream<INode>) {
	const child = next(input)
	input.next() // Plus(+)
	if (Temp.QMark.is(input.curr)) {
		input.next() // QMark(?)
		return [SingletonStream(() => new NonGreedyPlus(child))()]
	}
	return [SingletonStream(() => new GreedyPlus(child))()]
}

export const maybePlus: array.Pairs<INodeType, IStreamChooser> = [
	[Temp.Plus, handlePlus]
]
