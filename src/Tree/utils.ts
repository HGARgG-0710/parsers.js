import type {
	ITree,
	IInTree,
	ITreeConverter,
	ITreeConstructor,
	IReadonlyTree,
	IParentTree
} from "./interfaces.js"

import { isGoodIndex } from "../utils.js"
import { ParentTree } from "./classes.js"

import { object, functional } from "@hgargg-0710/one"
const { structCheck } = object
const { id } = functional

/**
 * Returns whether the given `x` is a `ReadonlyTree`, with at least 1 child
 */
export const hasChildren = structCheck<IReadonlyTree>({ lastChild: isGoodIndex }) as <
	Type = any
>(
	x: any
) => x is IReadonlyTree<Type>

/**
 * Sequentially indexes a given `tree` using `multind` for indicies array.
 * Provided correctness, results are stored in an array of `multind.length` length and then returned.
 */
export function sequentialIndex<
	Type = any,
	TreeType extends IReadonlyTree<Type> = IReadonlyTree<Type>
>(tree: IReadonlyTree<Type>, multind: number[]): IInTree<Type, TreeType>[] {
	const result: IInTree<Type>[] = [tree]
	let current: IInTree<Type> = tree
	for (const index of multind)
		result.push((current = (current as IReadonlyTree<Type>).index([index])))
	return result as IInTree<Type, TreeType>[]
}

/**
 * Creates a deep copy of the given recursive-array structure
 */
export function recursiveTreeCopy<Type = any>(treeConstructor: ITreeConstructor<Type>) {
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
export function treeEndPath<Type = any>(tree: IReadonlyTree<Type>) {
	const lastIndex: number[] = []
	let current = tree
	while (hasChildren(current)) {
		const { lastChild } = current
		lastIndex.push(lastChild)
		current = current.index([lastChild]) as IReadonlyTree<Type>
	}
	return lastIndex
}

/**
 * Returns a function that calls `x.map(converter)`
 */
export const mapper =
	<Type = any>(converter: (x: any) => Type | ITree<Type>): ITreeConverter<Type> =>
	(x: any[]) =>
		x.map(converter)

/**
 * Checks that the given item is a `ParentTree` (class)
 */
export const isParentTree = <Type = any>(child: any): child is IParentTree<Type> =>
	child instanceof ParentTree
