import { object } from "@hgargg-0710/one"
import type { Summat } from "@hgargg-0710/summat.ts"
import { TreeWalker } from "src/internal/TreeWalker.js"
import { BadIndex } from "../../constants.js"
import type { IWalkable } from "../../Node/interfaces.js"
import { withSuper } from "../../refactor.js"
import type { IStreamClassInstance } from "../interfaces.js"
import type { MultiIndex } from "../Position/classes.js"
import { StreamClass } from "../StreamClass/classes.js"
import type { IReversedStreamClassInstanceImpl } from "../StreamClass/refactor.js"

const { ConstDescriptor } = object.descriptor

import { methods } from "./methods.js"
const { init, value, pos, ...baseMethods } = methods

const TreeStreamBase = StreamClass<IWalkable, any>(baseMethods) as new <
	Type extends IWalkable<Type> = IWalkable
>() => IReversedStreamClassInstanceImpl<Type, any, MultiIndex>

export class TreeStream<TreeLike extends IWalkable<TreeLike> = IWalkable>
	extends TreeStreamBase<TreeLike>
	implements
		IStreamClassInstance<TreeLike, TreeLike, MultiIndex, [TreeLike?]>
{
	protected readonly super: Summat

	readonly value: TreeLike
	readonly pos: MultiIndex

	protected endInd: MultiIndex
	protected response: string = ""
	protected lastLevelWithSiblings = BadIndex
	protected walker = new TreeWalker<TreeLike>()

	init: (walkable?: TreeLike) => TreeStream<TreeLike>
	navigate: (position: MultiIndex) => TreeLike

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
