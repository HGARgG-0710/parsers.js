import type { InTreeType, Tree } from "../interfaces.js"
import type { Posed } from "../../Position/interfaces.js"
import type { MultiIndex } from "../../Position/MultiIndex/interfaces.js"
import type { MultiIndexModifier } from "../../Position/MultiIndex/MultiIndexModifier/interfaces.js"
import type { Currable } from "../../Stream/interfaces.js"
import type { Inputted } from "../../Stream/StreamClass/interfaces.js"

export interface TreeWalker<Type = any>
	extends Posed<MultiIndex>,
		Currable<InTreeType<Type>>,
		Inputted<Tree<Type>> {
	level: Tree<Type>
	modifier: MultiIndexModifier
	init: (input?: Tree<Type>, pos?: MultiIndex) => TreeWalker<Type>

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
}
