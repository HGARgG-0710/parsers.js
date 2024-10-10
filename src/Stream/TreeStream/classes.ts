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

import type { InTreeType, Tree } from "../../Tree/interfaces.js"
import type { MultiIndex as MultiIndexType } from "../../Position/MultiIndex/interfaces.js"
import type { TreeWalker as TreeWalkerType } from "../../Tree/TreeWalker/interfaces.js"

import { TreeWalker } from "../../Tree/TreeWalker/classes.js"
import { MultiIndex } from "../../Position/MultiIndex/classes.js"
import { StreamClass } from "../StreamClass/classes.js"

import { boolean } from "@hgargg-0710/one"
import type { Summat } from "@hgargg-0710/summat.ts"
import type { ReversedStreamClassInstance } from "../StreamClass/interfaces.js"
const { F } = boolean

const TreeStreamBase = StreamClass({
	initGetter: treeStreamInitCurr,
	baseNextIter: effectiveTreeStreamNext,
	basePrevIter: effectiveTreeStreamPrev,
	isCurrEnd: effectiveTreeStreamIsEnd,
	isCurrStart: effectiveTreeStreamIsStart,
	defaultIsEnd: F
}) as new () => ReversedStreamClassInstance

export class TreeStream<Type = any>
	extends TreeStreamBase
	implements EffectiveTreeStream<Type>
{
	input: Tree<Type>
	pos: MultiIndexType
	walker: TreeWalkerType<Type>
	response: string
	lastLevelWithSiblings: number

	copy: () => EffectiveTreeStream<Type>
	navigate: (position: MultiIndexType) => InTreeType<Type>
	super: Summat

	init: (tree?: Tree<Type>) => EffectiveTreeStream<Type>

	constructor(tree?: Tree<Type>) {
		super()
		this.pos = new MultiIndex([])
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
