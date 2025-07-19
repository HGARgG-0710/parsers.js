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

export const QMark = TokenNode("qmark")

const NonQMark = SingleChildNode("non-greedy-qmark")
const GreedyQMark = SingleChildNode("greedy-qmark")

function handleQMark(input: IOwnedStream<INode<string>>) {
	const child = next(input)
	input.next() // QMark(?)
	if (QMark.is(input.curr)) {
		input.next() // QMark(?)
		return SingletonStream(() => new NonQMark(child))()
	}
	return SingletonStream(() => new GreedyQMark(child))()
}

export const maybeQMark: array.Pairs<INodeType<string>, IStreamChooser> = [
	[QMark, handleQMark]
]
