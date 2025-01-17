import type { Tree, WalkableInTreeType } from "../interfaces.js"

export interface WalkableTree<Type = any> extends Tree<Type> {
	index: (multindex: readonly number[]) => WalkableInTreeType<Type>
	findUnwalkedChildren: (startIndex: readonly number[]) => number

	backtrack: (
		positions: number,
		currInd?: readonly number[]
	) => WalkableInTreeType<Type> | null
}
