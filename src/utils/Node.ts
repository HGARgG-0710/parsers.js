import { boolean, functional } from "@hgargg-0710/one"
import { type } from "../aliases/Node.js"
import type { NodeSystem } from "../classes/NodeSystem.js"
import type {
	IIterableStream,
	IParserFunction,
	ITableHandler
} from "../interfaces.js"
import type { ITyped, IWalkable } from "../interfaces/Node.js"
import { isTyped } from "../is/Node.js"
import { isGoodIndex } from "../utils.js"

const { trivialCompose } = functional
const { eqcurry } = boolean

/**
 * Returns whether the given `x` has at least 1 child
 */
export const hasChildren = <T extends IWalkable<T> = any>(x: IWalkable<T>) =>
	isGoodIndex(x.lastChild)

/**
 * Sequentially indexes a given `node` using `multind` for indicies array.
 * Provided correctness of the indexation path, results are stored in an
 * array of `1 + multind.length` length and then returned (including the `node`)
 */
export function sequentialIndex<T extends IWalkable<T> = any>(
	node: IWalkable<T>,
	multind: number[]
) {
	const result: IWalkable<T>[] = [node].concat(new Array(multind.length))
	for (let i = 0; i < multind.length; ++i)
		result[i + 1] = result[i].read(multind[i])
	return result
}

/**
 * Returns the multi-index (`number[]`) for the deep-rightmost (recursive-last)
 * element of the given `IWalkable<T>`
 */
export function treeEndPath<T extends IWalkable<T> = any>(node: IWalkable<T>) {
	const lastIndex: number[] = []
	let current = node
	while (hasChildren(current)) {
		const { lastChild } = current
		lastIndex.push(lastChild)
		current = current.read(lastChild)
	}
	return lastIndex
}

/**
 * Returns the predicate for checking that the `.type` property of the given
 * `ITyped` is equal to `_type`
 */
export const isType = <T = any>(_type: T): ((x: ITyped) => boolean) =>
	trivialCompose(eqcurry(_type), type)

/**
 * Returns a function `deserializer` that returns either:
 *
 * 1. `INode<T>` by calling `allowedTypes.getByType(from.type).fromPlain(from, deserializer)`,
 * which (basically) converts an object (which can be a result of deserialization) into
 * a valid tree within the given `NodeSystem`. Thus, it would, for instance, allow
 * deserializing strings with JSON objects into valid `INode<T>` objects, and therefore -
 * enable snapshot testing techniques for parsers developed using the library.
 * 2. `false`, if deserialization is impossible due to invalid object,
 * i.e. an object with no respective entry in `allowedType` for its `.type`,
 * or, better still, one without any type at all. Also, the `false` value may
 * actually be returned by the `.fromPlain` method itself (which is, in general,
 * expected to be recursive here - hence the passing of `deserializer`).
 */
export function fromObject<T = any>(allowedTypes: NodeSystem<T>) {
	function isValid(type: T): boolean {
		return allowedTypes.has(type)
	}

	return function deserializer(from: any) {
		if (!isTyped(from)) return false
		if (!isValid(from.type)) return false
		return allowedTypes.getByType(from.type)!.fromPlain(from, deserializer)
	}
}

/**
 * This maps a given `nodeStream` [it is assumed to have
 * an `IRecursiveNode`, or other collection-based node as
 * `nodeStream.curr`] with `mapWith(x, parentMap)`, for
 * every `x` in `nodeStream` after the immidiate
 * `nodeStream.curr` [which is skipped, since it is
 * assumed that it has been used for mapping to the function
 * in question].
 */
export function treeMap<T extends IWalkable<T> = IWalkable>(
	mapWith: ITableHandler<IIterableStream<T>>
): IParserFunction<IIterableStream<T>> {
	return function (
		nodeStream: IIterableStream<T>,
		parentMap?: ITableHandler<IIterableStream<T>>
	) {
		nodeStream.next()
		while (!nodeStream.isEnd) {
			mapWith(nodeStream, parentMap)
			nodeStream.next()
		}
	}
}
