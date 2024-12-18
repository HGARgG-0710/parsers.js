import type { Summat } from "@hgargg-0710/summat.ts"
import type { ReversedStreamConstructor } from "../StreamClass/interfaces.js"
import type { InTreeType, Tree } from "../../Tree/interfaces.js"
import type { MultiIndex as MultiIndexType } from "../../Position/MultiIndex/interfaces.js"
import type {
	TreeWalker as TreeWalkerType,
	WalkableTree
} from "../../Tree/TreeWalker/interfaces.js"
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
	treeStreamMultindGetter
} from "./methods.js"

import { extendPrototype } from "../../utils.js"
import { TreeWalker } from "../../Tree/TreeWalker/classes.js"
import { StreamClass } from "../StreamClass/classes.js"

import { defaults } from "../../constants.js"
const { response, lastLevelWithSiblings } = defaults.TreeStream

import { boolean } from "@hgargg-0710/one"
const { F } = boolean

const TreeStreamBase = StreamClass({
	currGetter: treeStreamCurrGetter,
	baseNextIter: treeStreamNext,
	basePrevIter: treeStreamPrev,
	isCurrEnd: treeStreamIsEnd,
	isCurrStart: treeStreamIsStart,
	defaultIsEnd: F
}) as ReversedStreamConstructor<InTreeType>

export class TreeStream<Type = any>
	extends TreeStreamBase
	implements EffectiveTreeStream<Type>
{
	response = response
	lastLevelWithSiblings = lastLevelWithSiblings

	readonly multind: MultiIndexType
	readonly value: WalkableTree<Type>

	walker: TreeWalkerType<Type>

	super: Summat
	navigate: (position: MultiIndexType) => InTreeType<Type>
	init: (tree?: Tree<Type>, walker?: TreeWalkerType<Type>) => EffectiveTreeStream<Type>

	constructor(
		tree?: WalkableTree<Type>,
		walker: TreeWalkerType<Type> = new TreeWalker<Type>(tree)
	) {
		super()
		this.init(tree, walker)
	}
}

extendPrototype(TreeStream, {
	super: { value: TreeStreamBase.prototype },
	multind: { get: treeStreamMultindGetter },
	value: { get: treeStreamValueGetter },
	rewind: { value: treeStreamRewind },
	navigate: { value: treeStreamNavigate },
	init: { value: treeStreamInitialize }
})
