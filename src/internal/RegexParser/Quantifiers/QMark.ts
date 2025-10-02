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
import { QMark } from "../Nodes.js"

const NonQMark = SingleChildNode("non-greedy-qmark")
const GreedyQMark = SingleChildNode("greedy-qmark")

function handleQMark(input: IOwnedStream<INode<string>>) {
	const child = next(input)
	input.next() // QMark(?)
	if (QMark.is(input.curr)) {
		input.next() // QMark(?)
		return [SingletonStream(() => new NonQMark(child))()]
	}
	return [SingletonStream(() => new GreedyQMark(child))()]
}

export const maybeQMark: array.Pairs<INodeType<string>, IStreamChooser> = [
	[QMark, handleQMark]
]
