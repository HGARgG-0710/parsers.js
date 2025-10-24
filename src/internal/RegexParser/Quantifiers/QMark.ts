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

const NonGreedyQMark = SingleChildNode("non-greedy-qmark", "NonGreedyQMark")
const GreedyQMark = SingleChildNode("greedy-qmark", "GreedyQMark")

function handleQMark(input: IOwnedStream<INode>) {
	const child = next(input)
	input.next() // QMark(?)
	if (Temp.QMark.is(input.curr)) {
		input.next() // QMark(?)
		return [SingletonStream(() => new NonGreedyQMark(child))()]
	}
	return [SingletonStream(() => new GreedyQMark(child))()]
}

export const maybeQMark: array.Pairs<INodeType, IStreamChooser> = [
	[Temp.QMark, handleQMark]
]
