import type { InTree, ReadonlyTree } from "../interfaces.js"

export interface WalkableTree<Type = any, T extends WalkableTree<Type> = any>
	extends ReadonlyTree<Type> {
	index: (multindex: readonly number[]) => InTree<Type, T>
	findUnwalkedChildren: (startIndex: readonly number[]) => number

	backtrack: (
		positions: number,
		currInd?: readonly number[]
	) => InTree<Type, WalkableTree<Type>> | null
}
