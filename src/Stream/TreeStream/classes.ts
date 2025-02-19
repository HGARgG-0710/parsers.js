import type { Summat } from "@hgargg-0710/summat.ts"
import type { ReversedStreamConstructor } from "../StreamClass/interfaces.js"
import type { InTree } from "../../Tree/interfaces.js"
import type { MultiIndex as MultiIndexType } from "../../Position/MultiIndex/interfaces.js"
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
} from "./refactor.js"

import { withSuper } from "src/refactor.js"
import { TreeWalker } from "../../Tree/TreeWalker/classes.js"
import { StreamClass } from "../StreamClass/abstract.js"

import { defaults } from "../../constants.js"
const { response, lastLevelWithSiblings } = defaults.TreeStream

import { boolean, object } from "@hgargg-0710/one"
const { F } = boolean
const { ConstDescriptor } = object.descriptor

const TreeStreamBase = StreamClass({
	currGetter: treeStreamCurrGetter,
	baseNextIter: treeStreamNext,
	basePrevIter: treeStreamPrev,
	isCurrEnd: treeStreamIsEnd,
	isCurrStart: treeStreamIsStart,
	defaultIsEnd: F
}) as ReversedStreamConstructor<InTree>

export class TreeStream<Type = any>
	extends TreeStreamBase
	implements EffectiveTreeStream<Type>
{
	response = response
	lastLevelWithSiblings = lastLevelWithSiblings

	readonly multind: MultiIndexType

	walker: TreeWalker<Type>
	super: Summat
	navigate: (position: MultiIndexType) => InTree<Type>
	init: (walker?: TreeWalker<Type>) => EffectiveTreeStream<Type>

	constructor(walker: TreeWalker<Type>) {
		super()
		this.init(walker)
	}
}

withSuper(TreeStream, TreeStreamBase, {
	multind: { get: treeStreamMultindGetter },
	value: { get: treeStreamValueGetter },
	rewind: ConstDescriptor(treeStreamRewind),
	navigate: ConstDescriptor(treeStreamNavigate),
	init: ConstDescriptor(treeStreamInitialize)
})
