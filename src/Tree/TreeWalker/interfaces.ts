import type { Tree, WalkableInTreeType } from "../interfaces.js"
import type { Posed } from "../../Position/interfaces.js"
import type { MultiIndex } from "../../Position/MultiIndex/interfaces.js"
import type { MultiIndexModifier } from "src/Position/MultiIndex/interfaces.js"
import type { Currable } from "../../Stream/interfaces.js"
import type { Pattern } from "../../Pattern/interfaces.js"

export interface TreeWalker<Type = any>
	extends Posed<MultiIndex>,
		Currable<WalkableInTreeType<Type>>,
		Pattern<WalkableTree<Type>> {
	level: WalkableTree<Type>
	modifier: MultiIndexModifier

	init: (input?: WalkableTree<Type>, pos?: MultiIndex) => TreeWalker<Type>

	getCurrChild: () => WalkableInTreeType<Type>
	levelUp: (positions?: number) => WalkableTree<Type>
	pushFirstChild: () => void
	popChild: () => number[]
	isSiblingAfter: () => boolean
	isSiblingBefore: () => boolean
	goSiblingAfter: () => number
	goSiblingBefore: () => number
	indexCut: (length: number) => void
	isChild: () => boolean
	isParent: () => boolean
	lastLevelWithSiblings: () => number
	currentLastIndex: () => number[]
	goPrevLast: () => void
	restart: () => void
	goIndex: (pos: MultiIndex) => void
	renewLevel: (
		init: WalkableTree<Type>,
		from: number,
		until?: number
	) => WalkableTree<Type>
}

export interface WalkableTree<Type = any> extends Tree<Type> {
	index: (multindex: readonly number[]) => WalkableInTreeType<Type>
	findUnwalkedChildren: (startIndex: readonly number[]) => number
	
	backtrack: (
		positions: number,
		currInd?: readonly number[]
	) => WalkableInTreeType<Type>
}
