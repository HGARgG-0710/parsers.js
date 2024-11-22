import type { Summat } from "@hgargg-0710/summat.ts"
import type { PatternReversedStreamConstructor } from "../StreamClass/interfaces.js"
import type { InTreeType, Tree } from "../../Tree/interfaces.js"
import type { MultiIndex as MultiIndexType } from "../../Position/MultiIndex/interfaces.js"
import type { TreeWalker as TreeWalkerType } from "../../Tree/TreeWalker/interfaces.js"
import type { TreeStream as EffectiveTreeStream } from "./interfaces.js"

import {
	treeStreamIsEnd,
	treeStreamPrev,
	treeStreamRewind,
	treeStreamNext,
	treeStreamNavigate,
	treeStreamIsStart,
	treeStreamInitialize,
	treeStreamCurrGetter,
	treeStreamValueGetter,
	treeStreamInputSetter
} from "./methods.js"

import { extendClass } from "../../utils.js"
import { TreeWalker } from "../../Tree/TreeWalker/classes.js"
import { StreamClass } from "../StreamClass/classes.js"

import { boolean } from "@hgargg-0710/one"
const { F } = boolean

const TreeStreamBase = StreamClass({
	currGetter: treeStreamCurrGetter,
	baseNextIter: treeStreamNext,
	basePrevIter: treeStreamPrev,
	isCurrEnd: treeStreamIsEnd,
	isCurrStart: treeStreamIsStart,
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

extendClass(TreeStream, {
	super: { value: TreeStreamBase.prototype },
	value: { get: treeStreamValueGetter, set: treeStreamInputSetter },
	rewind: { value: treeStreamRewind },
	navigate: { value: treeStreamNavigate },
	init: { value: treeStreamInitialize }
})
