import type {
	INode,
	IOwnedStream,
	IPoolNode,
	IPoolNodeType
} from "../../../../interfaces.js"
import { SingletonStream } from "../../../../objects/Stream.js"
import { next } from "../../../../utils/Stream.js"
import { RangeQuantifier } from "../Nodes.js"

const range = (child: INode, quantifier: IPoolNode<[INode]>) =>
	new RangeQuantifier(child, quantifier)

export function handleRangeQuantifier(input: IOwnedStream<INode>) {
	const child = next(input)
	const quantifier = next(input) as IPoolNode<[INode]>
	return [SingletonStream(() => range(child, quantifier))()]
}

export function handleQuantifier(PoolNodeType: IPoolNodeType<[INode]>) {
	return function (input: IOwnedStream<INode>) {
		const item = next(input)
		input.next() // Plus, QMark, Star, etc
		return [SingletonStream(() => new PoolNodeType(item))()]
	}
}
