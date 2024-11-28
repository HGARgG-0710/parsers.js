import type { MultiIndex } from "../../Position/MultiIndex/interfaces.js"
import type { MultiIndexModifier } from "../../Position/MultiIndex/MultiIndexModifier/interfaces.js"
import type { Tree, WalkableInTreeType } from "../interfaces.js"
import type { TreeWalker as TreeWalkerType, WalkableTree } from "./interfaces.js"
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
	treeWalkerInitialize,
	treeWalkerGetCurrChild,
	treeWalkerLevelUp
} from "./methods.js"

import { MultiIndex as MultiIndexClass } from "../../Position/MultiIndex/classes.js"
import { MultiIndexModifier as MultiIndexModifierClass } from "../../Position/MultiIndex/MultiIndexModifier/classes.js"
import { extendClass } from "../../utils.js"

export class TreeWalker<Type = any> implements TreeWalkerType<Type> {
	level: WalkableTree<Type>

	value: WalkableTree<Type>
	curr: WalkableInTreeType<Type>
	pos: MultiIndex
	modifier: MultiIndexModifier

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
	renewLevel: (init: Tree<Type>, from: number, until?: number) => WalkableTree<Type>
	restart: () => void
	goIndex: (pos: MultiIndex) => void

	init: (
		value?: WalkableTree<Type>,
		pos?: MultiIndex,
		modifier?: MultiIndexModifier
	) => TreeWalker<Type>

	constructor(
		value?: WalkableTree<Type>,
		pos: MultiIndex = new MultiIndexClass(),
		modifier: MultiIndexModifier = new MultiIndexModifierClass()
	) {
		this.init(value, pos, modifier)
	}
}

extendClass(TreeWalker, {
	getCurrChild: { value: treeWalkerGetCurrChild },
	levelUp: { value: treeWalkerLevelUp },
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
