import type { Summat } from "@hgargg-0710/summat.ts"
import type { Tree, InTreeType } from "./interfaces.js"

import { array, typeof as type, object } from "@hgargg-0710/one"
const { isArray } = type
const { propPreserve } = array
const { structCheck } = object

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
 * @returns a function that `.map`s the given array using `f`, while preserving all of its properties
 */
export const mapPropsPreserve = (
	f: (x?: any, i?: number, arr?: any[]) => any
): ((x: any[] & Summat) => any[] & Summat) =>
	propPreserve((array: any[]) => array.map(f), new Set(["length"]))

/**
 * Applies `recursiveArrayCopy` on all the elements of the given array, while copying it (returns the result)
 */
export const arrayTreeMapPreserve = mapPropsPreserve(baseRecursiveTreeCopy)

/**
 * Creates a deep copy of the given recursive-array structure
 */
export function recursiveTreeCopy(propName: string = "children") {
	if (!propName) return baseRecursiveTreeCopy
	const propCheck = structCheck({ [propName]: isArray })
	const T = (tree: any) =>
		propCheck(tree)
			? {
					...tree,
					[propName]: tree[propName].map(T)
			  }
			: tree
	return T
}

export function baseRecursiveTreeCopy(tree: any) {
	return isArray(tree) ? arrayTreeMapPreserve(tree) : tree
}
