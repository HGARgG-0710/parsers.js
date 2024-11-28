import type { Tree, InTreeType, TreeConverter, TreeConstructor } from "./interfaces.js"

import { isGoodIndex } from "../utils.js"

import { object, function as _f } from "@hgargg-0710/one"
const { structCheck } = object
const { id } = _f

export const hasChildren = structCheck<Tree>({ lastChild: isGoodIndex })

/**
 * Sequentially indexes a given `tree` using `multind` for indicies array.
 * Provided correctness, results are stored in an array of `multind.length` length and then returned.
 */
export function sequentialIndex<Type = any>(
	tree: Tree<Type>,
	multind: number[]
): InTreeType<Type>[] {
	const result: InTreeType<Type>[] = [tree]
	let current: InTreeType<Type> = tree
	for (const index of multind)
		result.push((current = (current as Tree<Type>).index([index])))
	return result
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

export function treeEndPath<Type = any>(tree: Tree<Type>) {
	const lastIndex: number[] = []
	let current = tree
	while (hasChildren(current)) {
		const { lastChild } = current
		lastIndex.push(lastChild)
		current = current.index([lastChild]) as Tree<Type>
	}
	return lastIndex
}

export const mapper =
	<Type = any>(converter: (x: any) => Type | Tree<Type>): TreeConverter<Type> =>
	(x: any[]) =>
		x.map(converter)
