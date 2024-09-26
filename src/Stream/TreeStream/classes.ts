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
import type { Tree } from "../../Tree/interfaces.js"

import { TreeWalker } from "./TreeWalker/classes.js"
import { StreamClass } from "../StreamClass/classes.js"

import { boolean } from "@hgargg-0710/one"
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

	constructor(tree?: Tree<Type>) {
		super()
		this.walker = new TreeWalker(this)
		this.init(tree)
		super.init()
	}
}

Object.defineProperties(TreeStream.prototype, {
	rewind: { value: effectiveTreeStreamRewind },
	copy: { value: effectiveTreeStreamCopy },
	navigate: { value: effectiveTreeStreamNavigate }
})

export * as TreeWalker from "./TreeWalker/classes.js"
export * as MultiIndex from "./MultiIndex/classes.js"
