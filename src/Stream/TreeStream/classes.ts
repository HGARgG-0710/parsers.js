import type { Summat } from "@hgargg-0710/summat.ts"
import type { PatternReversedStreamConstructor } from "../StreamClass/interfaces.js"
import type { InTreeType, Tree } from "../../Tree/interfaces.js"
import type { MultiIndex as MultiIndexType } from "../../Position/MultiIndex/interfaces.js"
import type { TreeWalker as TreeWalkerType } from "../../Tree/TreeWalker/interfaces.js"
import type { EffectiveTreeStream } from "./interfaces.js"

import {
	effectiveTreeStreamIsEnd,
	effectiveTreeStreamPrev,
	effectiveTreeStreamRewind,
	effectiveTreeStreamNext,
	effectiveTreeStreamNavigate,
	effectiveTreeStreamIsStart,
	effectiveTreeStreamInitialize,
	effectiveTreeStreamCurrGetter,
	effectiveTreeStreamValueGetter,
	effectiveTreeStreamInputSetter
} from "./methods.js"

import { TreeWalker } from "../../Tree/TreeWalker/classes.js"
import { StreamClass } from "../StreamClass/classes.js"

import { boolean } from "@hgargg-0710/one"
const { F } = boolean

const TreeStreamBase = StreamClass({
	currGetter: effectiveTreeStreamCurrGetter,
	baseNextIter: effectiveTreeStreamNext,
	basePrevIter: effectiveTreeStreamPrev,
	isCurrEnd: effectiveTreeStreamIsEnd,
	isCurrStart: effectiveTreeStreamIsStart,
	defaultIsEnd: F
}) as PatternReversedStreamConstructor<InTreeType>

export class TreeStream<Type = any>
	extends TreeStreamBase
	implements EffectiveTreeStream<Type>
{
	value: Tree<Type>
	walker: TreeWalkerType<Type>
	response: string
	lastLevelWithSiblings: number

	super: Summat
	navigate: (position: MultiIndexType) => InTreeType<Type>
	init: (tree?: Tree<Type>) => EffectiveTreeStream<Type>

	constructor(tree?: Tree<Type>) {
		super(tree)
		this.walker = new TreeWalker(tree)
		this.response = ""
		this.lastLevelWithSiblings = 0
		this.init(tree)
	}
}

Object.defineProperties(TreeStream.prototype, {
	value: { get: effectiveTreeStreamValueGetter, set: effectiveTreeStreamInputSetter },
	super: { value: TreeStreamBase.prototype },
	rewind: { value: effectiveTreeStreamRewind },
	navigate: { value: effectiveTreeStreamNavigate },
	init: { value: effectiveTreeStreamInitialize }
})
