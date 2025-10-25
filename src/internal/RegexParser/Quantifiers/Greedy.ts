import type {
	INode,
	IOwnedStream,
	IPoolNode,
	IPoolNodeType
} from "../../../interfaces.js"
import { SingletonStream } from "../../../objects/Stream.js"
import { next } from "../../../utils/Stream.js"
import { Greedy, NonGreedy, RangeQuantifier, Temp } from "../Nodes.js"

const range = (child: INode, quantifier: IPoolNode<[INode]>) =>
	new RangeQuantifier(child, quantifier)

export function handleRangeQuantifier(input: IOwnedStream<INode>) {
	const child = next(input)
	const quantifier = next(input) as IPoolNode<[INode]>
	if (Temp.QMark.is(input.curr)) {
		input.next() // QMark(?)
		return [
			SingletonStream(() => new NonGreedy(range(child, quantifier)))()
		]
	}
	return [SingletonStream(() => new Greedy(range(child, quantifier)))()]
}

export function handleQuantifier(PoolNodeType: IPoolNodeType<[INode]>) {
	return function (input: IOwnedStream<INode>) {
		const item = next(input)
		input.next()
		if (Temp.QMark.is(input.curr)) {
			input.next() // QMark(?)
			return [
				SingletonStream(() => new NonGreedy(new PoolNodeType(item)))()
			]
		}
		return [SingletonStream(() => new Greedy(new PoolNodeType(item)))()]
	}
}
