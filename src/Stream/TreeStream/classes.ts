import type { EffectiveTreeStream } from "./interfaces.js"
import {
	treeStreamInitCurr,
	effectiveTreeStreamIsEnd,
	effectiveTreeStreamPrev,
	effectiveTreeStreamRewind,
	effectiveTreeStreamNext,
	effectiveTreeStreamCopy,
	effectiveTreeStreamNavigate,
	effectiveTreeStreamIsStart
} from "./methods.js"

import type { MultiIndex } from "./MultiIndex/interfaces.js"
import type { TreeWalker as TreeWalkerType } from "./TreeWalker/interfaces.js"
import type { InTreeType, Tree } from "../../Tree/interfaces.js"

import { TreeWalker } from "./TreeWalker/classes.js"
import { StreamClass } from "../StreamClass/classes.js"

import { boolean } from "@hgargg-0710/one"
import type { Summat } from "@hgargg-0710/summat.ts"
import type { Position } from "../PositionalStream/Position/interfaces.js"
const { F } = boolean

export const TreeStreamBase = StreamClass({
	initGetter: treeStreamInitCurr,
	baseNextIter: effectiveTreeStreamNext,
	basePrevIter: effectiveTreeStreamPrev,
	isCurrEnd: effectiveTreeStreamIsEnd,
	isCurrStart: effectiveTreeStreamIsStart,
	defaultIsEnd: F
})

export class TreeStream<Type = any>
	extends TreeStreamBase
	implements EffectiveTreeStream<Type>
{
	input: Tree<Type>
	pos: MultiIndex
	walker: TreeWalkerType<Type>
	response: string
	lastLevelWithSiblings: number

	prev: () => Type
	isCurrStart: () => boolean

	copy: () => EffectiveTreeStream<Type>
	rewind: () => Type
	navigate: (position: Position) => InTreeType<Type>
	super: Summat

	constructor(tree?: Tree<Type>) {
		super()
		this.walker = new TreeWalker(this)
		this.init(tree)
	}
}

Object.defineProperties(TreeStream.prototype, {
	super: { value: TreeStreamBase.prototype },
	rewind: { value: effectiveTreeStreamRewind },
	copy: { value: effectiveTreeStreamCopy },
	navigate: { value: effectiveTreeStreamNavigate }
})

export * as TreeWalker from "./TreeWalker/classes.js"
export * as MultiIndex from "./MultiIndex/classes.js"
