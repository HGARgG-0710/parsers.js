import type {
	Tree,
	InTree,
	TreeConverter,
	TreeConstructor,
	ReadonlyTree,
	IParentTree
} from "./interfaces.js"

import { isGoodIndex } from "src/utils.js"
import { ParentTree } from "./classes.js"

import { object, functional } from "@hgargg-0710/one"
const { structCheck } = object
const { id } = functional

/**
 * Returns whether the given `x` is a `ReadonlyTree`, with at least 1 child
 */
export const hasChildren = structCheck<ReadonlyTree>({ lastChild: isGoodIndex }) as <
	Type = any
>(
	x: any
) => x is ReadonlyTree<Type>

/**
 * Sequentially indexes a given `tree` using `multind` for indicies array.
 * Provided correctness, results are stored in an array of `multind.length` length and then returned.
 */
export function sequentialIndex<
	Type = any,
	TreeType extends ReadonlyTree<Type> = ReadonlyTree<Type>
>(tree: ReadonlyTree<Type>, multind: number[]): InTree<Type, TreeType>[] {
	const result: InTree<Type>[] = [tree]
	let current: InTree<Type> = tree
	for (const index of multind)
		result.push((current = (current as ReadonlyTree<Type>).index([index])))
	return result as InTree<Type, TreeType>[]
}

/**
 * Creates a deep copy of the given recursive-array structure
 */
export function recursiveTreeCopy<Type = any>(treeConstructor: TreeConstructor<Type>) {
	const T = (tree: any) =>
		tree instanceof treeConstructor
			? new treeConstructor(tree.children.map(T), id)
			: tree
	return T
}

/**
 * Returns the multi-index (`number[]`) for the rightmost (recursive-last)
 * element of the given `ReadonlyTree`
 */
export function treeEndPath<Type = any>(tree: ReadonlyTree<Type>) {
	const lastIndex: number[] = []
	let current = tree
	while (hasChildren(current)) {
		const { lastChild } = current
		lastIndex.push(lastChild)
		current = current.index([lastChild]) as ReadonlyTree<Type>
	}
	return lastIndex
}

/**
 * Returns a function that calls `x.map(converter)`
 */
export const mapper =
	<Type = any>(converter: (x: any) => Type | Tree<Type>): TreeConverter<Type> =>
	(x: any[]) =>
		x.map(converter)

/**
 * Checks that the given item is a `ParentTree` (class)
 */
export const isParentTree = <Type = any>(child: any): child is IParentTree<Type> =>
	child instanceof ParentTree
