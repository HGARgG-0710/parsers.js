import type { Summat } from "@hgargg-0710/summat.ts"
import type { IWalkable } from "../../Node/interfaces.js"
import type { MultiIndex } from "../Position/classes.js"
import type { IStreamClassInstance } from "../interfaces.js"
import type { IReversedStreamClassInstanceImpl } from "../StreamClass/refactor.js"

import { withSuper } from "../../refactor.js"
import { TreeWalker } from "src/internal/TreeWalker.js"
import { StreamClass } from "../StreamClass/classes.js"

import { BadIndex } from "../../constants.js"

import { object } from "@hgargg-0710/one"
const { ConstDescriptor } = object.descriptor

import { methods } from "./methods.js"
const { init, value, pos, ...baseMethods } = methods

const TreeStreamBase = StreamClass<IWalkable, any, MultiIndex>(
	baseMethods
) as new <
	Type extends IWalkable<Type> = IWalkable
>() => IReversedStreamClassInstanceImpl<Type, any, MultiIndex<Type>>

export class TreeStream<TreeLike extends IWalkable<TreeLike> = IWalkable>
	extends TreeStreamBase<TreeLike>
	implements
		IStreamClassInstance<TreeLike, TreeLike, MultiIndex, [TreeLike?]>
{
	protected readonly super: Summat

	readonly value: TreeLike

	protected endInd: MultiIndex
	protected response: string = ""
	protected lastLevelWithSiblings = BadIndex
	protected walker = new TreeWalker<TreeLike>()

	readonly pos: MultiIndex<TreeLike>

	init: (walkable?: TreeLike) => TreeStream<TreeLike>
	navigate: (position: MultiIndex<TreeLike>) => TreeLike

	constructor(walkable?: TreeLike) {
		super()
		this.init(walkable)
	}
}

withSuper(TreeStream, TreeStreamBase, {
	pos,
	value,
	init: ConstDescriptor(init)
})
