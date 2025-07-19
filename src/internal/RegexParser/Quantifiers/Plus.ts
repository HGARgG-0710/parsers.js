import type { array } from "@hgargg-0710/one"
import { SingleChildNode, TokenNode } from "../../../classes/Node.js"
import { SingletonStream } from "../../../classes/Stream.js"
import type {
	INode,
	INodeType,
	IOwnedStream,
	IStreamChooser
} from "../../../interfaces.js"
import { next } from "../../../utils/Stream.js"
import { QMark } from "./QMark.js"

export const Plus = TokenNode("plus")
const NonGreedyPlus = SingleChildNode("non-greedy-plus")
const GreedyPlus = SingleChildNode("greedy-plus")

function handlePlus(input: IOwnedStream<INode<string>>) {
	const child = next(input)
	input.next() // Plus(+)
	if (QMark.is(input.curr)) {
		input.next() // QMark(?)
		return SingletonStream(() => new NonGreedyPlus(child))()
	}
	return SingletonStream(() => new GreedyPlus(child))()
}

export const maybePlus: array.Pairs<INodeType<string>, IStreamChooser> = [
	[Plus, handlePlus]
]
