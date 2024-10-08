import type { Summat } from "@hgargg-0710/summat.ts"
import type { Tree } from "../../../Tree/interfaces.js"
import type { BasicTreeStream } from "../interfaces.js"

export interface TreeWalker<Type = any> extends Summat {
	stream: BasicTreeStream<Type>
	level: Tree<Type>
	init: (treeStream: Tree<Type>) => TreeWalker<Type>

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
	renewLevel: (init?: Tree<Type>) => void
	restart: () => void
	goIndex: () => void
}
