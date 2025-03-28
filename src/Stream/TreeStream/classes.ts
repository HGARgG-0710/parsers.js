import type { Summat } from "@hgargg-0710/summat.ts"
import type { IWalkable } from "../../Node/interfaces.js"
import type { ITreeStream } from "./interfaces.js"
import type { IReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { MultiIndex } from "../../Position/classes.js"

import { withSuper } from "../../refactor.js"
import { TreeWalker } from "src/internal/TreeWalker.js"
import { StreamClass } from "../StreamClass/classes.js"

import { BadIndex } from "../../constants.js"

import { boolean, object } from "@hgargg-0710/one"
const { F } = boolean
const { ConstDescriptor } = object.descriptor

import { methods } from "./methods.js"
const { rewind, navigate, init, value, pos, ...baseMethods } = methods

const TreeStreamBase = StreamClass<IWalkable>({
	...baseMethods,
	defaultIsEnd: F
}) as new <
	Type extends IWalkable<Type> = IWalkable
>() => IReversedStreamClassInstance<Type>

export class TreeStream<TreeLike extends IWalkable<TreeLike> = IWalkable>
	extends TreeStreamBase<TreeLike>
	implements ITreeStream<TreeLike>
{
	protected response: string = ""
	protected lastLevelWithSiblings = BadIndex
	protected walker = new TreeWalker<TreeLike>()

	readonly pos: MultiIndex

	super: Summat
	init: (walkable?: TreeLike) => ITreeStream
	navigate: (position: MultiIndex) => TreeLike

	constructor(walkable?: TreeLike) {
		super()
		this.init(walkable)
	}
}

withSuper(TreeStream, TreeStreamBase, {
	multind: pos,
	value,
	rewind: ConstDescriptor(rewind),
	navigate: ConstDescriptor(navigate),
	init: ConstDescriptor(init)
})
