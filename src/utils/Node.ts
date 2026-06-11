import { type as _type, boolean, object } from "@hgargg-0710/one"
import type {
	IChildrenHaving,
	ITyped,
	IValidNodeType,
	IValued,
	IWalkable,
	IWithChild
} from "../interfaces/Node.js"
import type { NodeSystem } from "../objects/NodeSystem.js"
import { TreeStream } from "../objects/Stream.js"
import { isGoodIndex } from "../utils.js"

const { T } = boolean
const { prop, structCheck } = object
const { isArray, isString, isNumber, isStruct } = _type

/**
 * Returns whether the given `x` has at least 1 child
 */
export const hasChildren = <T extends IWalkable<T> = any>(
	x: IWalkable<T>
) => isGoodIndex(x.lastChild)

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
export function treeEndPath<T extends IWalkable<T> = any>(
	node: IWalkable<T>
) {
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
export const isType =
	<T = any>(_type: T) =>
	(x: ITyped) =>
		_type === x.type

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
	function isTypeValid(type: IValidNodeType): boolean {
		return allowedTypes.has(type)
	}

	// ! pre-doc [important]: when needing to have a toplevel array of items,
	// 		simply use a RecursiveNode [the array support is not added precisely
	// 		because of how it would break correct handling of hierarchy checking;
	//		besides, the RecursiveNode route is way more elegant in any case]
	return function nodeWrapper(from: any) {
		if (!isTyped(from)) return false
		if (!isTypeValid(from.type)) return false
		return allowedTypes.getByType(from.type)!.fromPlain(from, nodeWrapper)
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

export const isNodeType = (x: any): x is IValidNodeType =>
	isString(x) || isNumber(x)

/**
 * Verifies that given input is a non-`null` object with `.type` and `.value` properties on it.
 */
export const isContentNodeLike = structCheck<ITyped & IValued>({
	type: isNodeType,
	value: T
})

export const isSingleChildNodeLike = structCheck<ITyped & IWithChild>({
	type: isNodeType,
	child: (x) => !!isStruct(x)
})

/**
 * Verifies that given input is a non-`null` object with `.type` and `.children` property,
 * the latter of which is an array.
 */
export const isRecursiveNodeLike = structCheck<ITyped & IChildrenHaving>({
	type: isNodeType,
	children: isArray
})

export function mapTypeTable<T = any>(
	typeTable: [ITyped, T][]
): [IValidNodeType, T][] {
	return typeTable.map(([t, f]) => [t.type, f])
}

export function search<T extends IWalkable = IWalkable>(
	root: T,
	pred: (x: T) => boolean
) {
	const asDepthFirst = new TreeStream(root)
	for (const item of asDepthFirst)
		if (pred(item)) return asDepthFirst.treeIndex
	return false
}

export function depth<T extends IWalkable = IWalkable>(root: T) {
	const asDepthFirst = new TreeStream(root)
	let maxDepth = 0
	for (const _ of asDepthFirst)
		maxDepth = Math.max(asDepthFirst.treeIndex.length, maxDepth)
	return maxDepth
}

export function count<T extends IWalkable = IWalkable>(
	root: T,
	pred: (x: T) => number = () => 1
) {
	const asDepthFirst = new TreeStream(root)
	let sum = 0
	for (const item of asDepthFirst) sum += pred(item)
	return sum
}
