import type { INode, IOwnedStream, IPoolNode } from "../../../interfaces.js"
import { SingletonStream } from "../../../objects/Stream.js"
import { next } from "../../../utils/Stream.js"
import { Greedy, NonGreedy, QMark } from "../Nodes.js"

export function handleQuantifier(input: IOwnedStream<INode>) {
	const child = next(input)
	const quantifier = next(input) as IPoolNode<[INode]>
	if (QMark.is(input.curr)) {
		input.next() // QMark(?)
		return [SingletonStream(() => new NonGreedy(child, quantifier))()]
	}
	return [SingletonStream(() => new Greedy(child, quantifier))()]
}
