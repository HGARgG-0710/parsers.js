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
import { Plus } from "../Nodes.js"
import { QMark } from "../Nodes.js"

const NonGreedyPlus = SingleChildNode("non-greedy-plus", "NonGreedyPlus")
const GreedyPlus = SingleChildNode("greedy-plus", "GreedyPlus")

function handlePlus(input: IOwnedStream<INode<string>>) {
	const child = next(input)
	input.next() // Plus(+)
	if (QMark.is(input.curr)) {
		input.next() // QMark(?)
		return [SingletonStream(() => new NonGreedyPlus(child))()]
	}
	return [SingletonStream(() => new GreedyPlus(child))()]
}

export const maybePlus: array.Pairs<INodeType<string>, IStreamChooser> = [
	[Plus, handlePlus]
]
