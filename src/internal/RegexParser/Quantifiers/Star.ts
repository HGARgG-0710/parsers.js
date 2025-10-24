import type { array } from "@hgargg-0710/one"
import type {
	INode,
	INodeType,
	IOwnedStream,
	IStreamChooser
} from "../../../interfaces.js"
import { SingletonStream } from "../../../objects/Stream.js"
import { next } from "../../../utils/Stream.js"
import { GreedyStar, NonGreedyStar, Temp } from "../Nodes.js"

function handleStar(input: IOwnedStream<INode>) {
	const child = next(input)
	input.next() // Star(*)
	if (Temp.QMark.is(input.curr)) {
		input.next() // QMark(?)
		return [SingletonStream(() => new NonGreedyStar(child))()]
	}
	return [SingletonStream(() => new GreedyStar(child))()]
}

export const maybeStar: array.Pairs<INodeType, IStreamChooser> = [
	[Temp.Star, handleStar]
]
