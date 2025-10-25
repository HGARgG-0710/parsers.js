import { type as _type, boolean, functional, object } from "@hgargg-0710/one"
import type {
	IIterableStream,
	IParserFunction,
	ITableHandler
} from "../interfaces.js"
import type {
	IChildrenHaving,
	ITyped,
	IValidNodeType,
	IValued,
	IWalkable
} from "../interfaces/Node.js"
import type { NodeSystem } from "../objects/NodeSystem.js"
import { isGoodIndex } from "../utils.js"

const { trivialCompose } = functional
const { eqcurry, T } = boolean
const { prop, structCheck } = object
const { isArray } = _type

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
 * Returns a function `nodeWrapper` that returns either:
 *
 * 1. `INode` by calling `allowedTypes.getByType(from.type).fromPlain(from, nodeWrapper)`,
 * which (basically) converts an object (which can be a result of deserialization) into
 * a valid tree within the given `NodeSystem`. Thus, it would, for instance, allow
 * deserializing strings with JSON objects into valid `INode` objects, and therefore -
 * enable snapshot testing techniques for parsers developed using the library.
 * 2. `false`, if deserialization is impossible due to invalid object,
 * i.e. an object with no respective entry in `allowedType` for its `.type`,
 * or, better still, one without any type at all. Also, the `false` value may
 * actually be returned by the `.fromPlain` method itself (which is, in general,
 * expected to be recursive here - hence the passing of `deserializer`).
 */
export function fromObject(allowedTypes: NodeSystem) {
	function isValid(type: IValidNodeType): boolean {
		return allowedTypes.has(type)
	}

	return function nodeWrapper(from: any) {
		if (!isTyped(from)) return false
		if (!isValid(from.type)) return false
		return allowedTypes.getByType(from.type)!.fromPlain(from, nodeWrapper)
	}
}

/**
 * This returns a generator that yields the result of
 * mapping a given `nodeStream` [it is assumed to have
 * an `IRecursiveNode`, or other collection-based node as
 * `nodeStream.curr`] with `parentMap(x, parentMap)` (and
 * default `parentMap` being `defaultMap`), for
 * every `x` in `nodeStream` after the immidiate
 * `nodeStream.curr` [which is skipped, since it is
 * assumed that it has been used for mapping to the function
 * in question].
 */
export function treeMap<T extends IWalkable<T> = IWalkable, Out = any>(
	defaultMap: ITableHandler<IIterableStream<T>, Iterable<Out>>
): IParserFunction<IIterableStream<T>, Iterable<Out>> {
	return function* (
		nodeStream: IIterableStream<T>,
		parentMap: ITableHandler<IIterableStream<T>, Iterable<Out>> = defaultMap
	) {
		nodeStream.next()
		for (const _ of nodeStream) yield* parentMap(nodeStream, parentMap)
	}
}

/**
 * Returns the value of the `x.type` for the given `ITyped`
 */
export const type = prop("type") as <T = any>(x: ITyped) => IValidNodeType

/**
 * Verifies that given input is a non-`null` object with a `.type` property on it.
 */
export const isTyped = structCheck<ITyped>(["type"])

/**
 * Verifies that given input is a non-`null` object with `.type` and `.value` properties on it.
 */
export const isContentNodeSerializable = structCheck<ITyped & IValued>([
	"type",
	"value"
])

/**
 * Verifies that given input is a non-`null` object with `.type` and `.children` property,
 * the latter of which is an array.
 */
export const isRecursiveNodeSerializable = structCheck<
	ITyped & IChildrenHaving
>({
	type: T,
	children: isArray
})

export function mapTypes<T = any>(
	typeTable: [ITyped, T][]
): [IValidNodeType, T][] {
	return typeTable.map(([t, f]) => [t.type, f])
}
