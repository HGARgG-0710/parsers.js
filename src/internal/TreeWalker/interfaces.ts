import type { IInTree, IReadonlyTree } from "../../Tree/interfaces.js"

export interface IWalkableTree<Type = any, T extends IWalkableTree<Type> = any>
	extends IReadonlyTree<Type> {
	index: (multindex: readonly number[]) => IInTree<Type, T>
	findUnwalkedChildren: (startIndex: readonly number[]) => number

	backtrack: (
		positions: number,
		currInd?: readonly number[]
	) => IInTree<Type, IWalkableTree<Type>> | null
}
