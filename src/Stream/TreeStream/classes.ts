import type { Summat } from "@hgargg-0710/summat.ts"
import type { ReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { InTreeType, Tree } from "../../Tree/interfaces.js"
import type { MultiIndex as MultiIndexType } from "../../Position/MultiIndex/interfaces.js"
import type { TreeWalker as TreeWalkerType } from "../../Tree/TreeWalker/interfaces.js"
import type { EffectiveTreeStream } from "./interfaces.js"

import {
	effectiveTreeStreamIsEnd,
	effectiveTreeStreamPrev,
	effectiveTreeStreamRewind,
	effectiveTreeStreamNext,
	effectiveTreeStreamCopy,
	effectiveTreeStreamNavigate,
	effectiveTreeStreamIsStart,
	effectiveTreeStreamInitialize,
	effectiveTreeStreamCurrGetter,
	effectiveTreeStreamInputGetter,
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
}) as new () => ReversedStreamClassInstance

export class TreeStream<Type = any>
	extends TreeStreamBase
	implements EffectiveTreeStream<Type>
{
	input: Tree<Type>
	walker: TreeWalkerType<Type>
	response: string
	lastLevelWithSiblings: number

	copy: () => EffectiveTreeStream<Type>
	navigate: (position: MultiIndexType) => InTreeType<Type>
	super: Summat

	init: (tree?: Tree<Type>) => EffectiveTreeStream<Type>

	constructor(tree?: Tree<Type>) {
		super()
		this.walker = new TreeWalker(tree)
		this.response = ""
		this.lastLevelWithSiblings = 0
		this.init(tree)
	}
}

Object.defineProperties(TreeStream.prototype, {
	input: { get: effectiveTreeStreamInputGetter, set: effectiveTreeStreamInputSetter },
	super: { value: TreeStreamBase.prototype },
	rewind: { value: effectiveTreeStreamRewind },
	copy: { value: effectiveTreeStreamCopy },
	navigate: { value: effectiveTreeStreamNavigate },
	init: { value: effectiveTreeStreamInitialize }
})
