import { fromEnum } from "../EnumSpace/utils.js"
import { isGoodIndex } from "../utils.js"
import { ContentNode, RecursiveNode, TokenNode } from "./classes.js"

import type { IWalkable } from "./interfaces.js"

export const tokenNodes = fromEnum(TokenNode)
export const contentNodes = fromEnum(ContentNode)
export const recursiveNodes = fromEnum(RecursiveNode)

/**
 * Returns whether the given `x` has at least 1 child
 */
export const hasChildren = <Type extends IWalkable<Type> = any>(
	x: IWalkable<Type>
) => isGoodIndex(x.lastChild)

/**
 * Sequentially indexes a given `node` using `multind` for indicies array.
 * Provided correctness, results are stored in an array of `multind.length` length and then returned.
 */
export function sequentialIndex<Type extends IWalkable<Type> = any>(
	node: IWalkable<Type>,
	multind: number[]
) {
	const result: IWalkable<Type>[] = [node].concat(new Array(multind.length))
	for (let i = 0; i < multind.length; ++i)
		result[i + 1] = result[i].read(multind[i])
	return result
}

/**
 * Returns the multi-index (`number[]`) for the rightmost (recursive-last)
 * element of the given `IWalkable`
 */
export function treeEndPath<Type extends IWalkable<Type> = any>(
	node: IWalkable<Type>
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
