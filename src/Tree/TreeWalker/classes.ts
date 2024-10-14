import type { MultiIndex } from "../../Position/MultiIndex/interfaces.js"
import type { MultiIndexModifier } from "../../Position/MultiIndex/MultiIndexModifier/interfaces.js"
import type { InTreeType, Tree } from "../interfaces.js"
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

import { MultiIndex as MultiIndexClass } from "../../Position/MultiIndex/classes.js"
import { MultiIndexModifier as MultiIndexModifierClass } from "../../Position/MultiIndex/MultiIndexModifier/classes.js"

export class TreeWalker<Type = any> implements TreeWalkerType<Type> {
	level: Tree<Type>

	input: Tree<Type>
	curr: InTreeType<Type>
	pos: MultiIndex
	modifier: MultiIndexModifier

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
	renewLevel: (init?: Tree<Type>, from?: number, until?: number) => void
	restart: () => void
	goIndex: (pos: MultiIndex) => void
	init: (input?: Tree<Type>, pos?: MultiIndex) => TreeWalker<Type>

	constructor(input?: Tree<Type>, pos: MultiIndex = new MultiIndexClass()) {
		this.modifier = new MultiIndexModifierClass(pos)
		this.init(input, pos)
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
