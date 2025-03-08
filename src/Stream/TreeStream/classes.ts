import type { Summat } from "@hgargg-0710/summat.ts"
import type { InTree } from "../../Tree/interfaces.js"
import type { IMultiIndex } from "../../Position/MultiIndex/interfaces.js"
import type { ITreeStream } from "./interfaces.js"

import { methods } from "./refactor.js"

const {
	isCurrEnd,
	basePrevIter,
	rewind,
	baseNextIter,
	navigate,
	isCurrStart,
	init,
	currGetter,
	value,
	multind
} = methods

import { withSuper } from "src/refactor.js"
import { TreeWalker } from "../../Tree/TreeWalker/classes.js"
import { StreamClass } from "../StreamClass/abstract.js"

import { defaults } from "../../constants.js"
const { lastLevelWithSiblings } = defaults.TreeStream

import { boolean, object } from "@hgargg-0710/one"
import type { AbstractConstructor } from "../StreamClass/refactor.js"
import type { ReversedStreamClassInstance } from "../StreamClass/interfaces.js"
const { F } = boolean
const { ConstDescriptor } = object.descriptor

const TreeStreamBase = StreamClass({
	currGetter,
	baseNextIter,
	basePrevIter,
	isCurrEnd,
	isCurrStart,
	defaultIsEnd: F
}) as AbstractConstructor<[], ReversedStreamClassInstance<InTree>>

export class TreeStream<Type = any> extends TreeStreamBase implements ITreeStream<Type> {
	protected response = ""
	protected lastLevelWithSiblings = lastLevelWithSiblings
	protected walker: TreeWalker<Type>

	readonly multind: IMultiIndex

	super: Summat
	navigate: (position: IMultiIndex) => InTree<Type>
	init: (walker?: TreeWalker<Type>) => ITreeStream<Type>

	constructor(walker: TreeWalker<Type>) {
		super()
		this.init(walker)
	}
}

withSuper(TreeStream, TreeStreamBase, {
	multind,
	value,
	rewind: ConstDescriptor(rewind),
	navigate: ConstDescriptor(navigate),
	init: ConstDescriptor(init)
})
