import type { InTree, Tree } from "../interfaces.js"

export interface WalkableTree<Type = any> extends Tree<Type> {
	index: (multindex: readonly number[]) => InTree<Type, WalkableTree<Type>>
	findUnwalkedChildren: (startIndex: readonly number[]) => number

	backtrack: (
		positions: number,
		currInd?: readonly number[]
	) => InTree<Type, WalkableTree<Type>> | null
}
