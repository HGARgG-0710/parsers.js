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

export const Star = TokenNode("star")

const NonGreedyStar = SingleChildNode("non-greedy-star")
const GreedyStar = SingleChildNode("greedy-star")

function handleStar(input: IOwnedStream<INode<string>>) {
	const child = next(input)
	input.next() // Star(*)
	if (QMark.is(input.curr)) {
		input.next() // QMark(?)
		return SingletonStream(() => new NonGreedyStar(child))()
	}
	return SingletonStream(() => new GreedyStar(child))()
}

export const maybeStar: array.Pairs<INodeType<string>, IStreamChooser> = [
	[Star, handleStar]
]
