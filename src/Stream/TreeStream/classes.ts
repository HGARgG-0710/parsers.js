import type { Summat } from "@hgargg-0710/summat.ts"
import type { InTree } from "../../Tree/interfaces.js"
import type { IMultiIndex } from "../../Position/MultiIndex/interfaces.js"
import type { ITreeStream } from "./interfaces.js"

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
import type { AbstractConstructor } from "../StreamClass/refactor.js"
import type { ReversedStreamClassInstance } from "../StreamClass/interfaces.js"
const { F } = boolean
const { ConstDescriptor } = object.descriptor

const TreeStreamBase = StreamClass({
	currGetter: treeStreamCurrGetter,
	baseNextIter: treeStreamNext,
	basePrevIter: treeStreamPrev,
	isCurrEnd: treeStreamIsEnd,
	isCurrStart: treeStreamIsStart,
	defaultIsEnd: F
}) as AbstractConstructor<[], ReversedStreamClassInstance<InTree>>

export class TreeStream<Type = any> extends TreeStreamBase implements ITreeStream<Type> {
	response = response
	lastLevelWithSiblings = lastLevelWithSiblings

	readonly multind: IMultiIndex

	walker: TreeWalker<Type>
	super: Summat
	navigate: (position: IMultiIndex) => InTree<Type>
	init: (walker?: TreeWalker<Type>) => ITreeStream<Type>

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
