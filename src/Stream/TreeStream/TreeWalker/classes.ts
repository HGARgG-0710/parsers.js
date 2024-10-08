import type { Tree } from "../../../Tree/interfaces.js"
import type { BasicTreeStream } from "../interfaces.js"
import type { TreeWalker as TreeWalkerType } from "./interfaces.js"
import {
	treeWalkerPushFirstChild,
	treeWalkerPopChild,
	treeWalkerIsSiblingAfter,
	treeWalkerIsSiblingBefore,
	treeWalkerGoSiblingAfter,
	treeWalkerGoSiblingBefore,
	treeWalkerIndexCut,
	treeWalkerIsChild,
	treeWalkerIsParent,
	treeWalkerLastLevelWithSiblings,
	treeWalkerCurrentLastIndex,
	treeWalkerGoPrevLast,
	treeWalkerRenewLevel,
	treeWalkerRestart,
	treeWalkerGoIndex,
	treeWalkerInitialize
} from "./methods.js"

export class TreeWalker<Type = any> implements TreeWalkerType<Type> {
	stream: BasicTreeStream<Type>
	level: Tree<Type>

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
	renewLevel: () => void
	restart: () => void
	goIndex: () => void
	init: (treeStream?: Tree<Type>) => TreeWalker<Type>

	constructor(treeStream: BasicTreeStream<Type>) {
		this.stream = treeStream
		this.init(treeStream.input)
	}
}

Object.defineProperties(TreeWalker.prototype, {
	pushFirstChild: { value: treeWalkerPushFirstChild },
	popChild: { value: treeWalkerPopChild },
	isSiblingAfter: { value: treeWalkerIsSiblingAfter },
	isSiblingBefore: { value: treeWalkerIsSiblingBefore },
	goSiblingAfter: { value: treeWalkerGoSiblingAfter },
	goSiblingBefore: { value: treeWalkerGoSiblingBefore },
	indexCut: { value: treeWalkerIndexCut },
	isChild: { value: treeWalkerIsChild },
	isParent: { value: treeWalkerIsParent },
	lastLevelWithSiblings: { value: treeWalkerLastLevelWithSiblings },
	currentLastIndex: { value: treeWalkerCurrentLastIndex },
	goPrevLast: { value: treeWalkerGoPrevLast },
	renewLevel: { value: treeWalkerRenewLevel },
	restart: { value: treeWalkerRestart },
	goIndex: { value: treeWalkerGoIndex },
	init: { value: treeWalkerInitialize }
})
