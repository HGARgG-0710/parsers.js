import type { Summat } from "@hgargg-0710/summat.ts"
import type { IWalkable } from "../../Node/interfaces.js"
import type { ITreeStream } from "./interfaces.js"
import type { Constructor } from "../StreamClass/refactor.js"
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
const { rewind, navigate, init, value, multind, ...baseMethods } = methods

const TreeStreamBase = StreamClass<IWalkable>({
	...baseMethods,
	defaultIsEnd: F
}) as Constructor<[], IReversedStreamClassInstance<IWalkable>>

export class TreeStream extends TreeStreamBase implements ITreeStream {
	protected response: string
	protected lastLevelWithSiblings = BadIndex
	protected walker = new TreeWalker()

	readonly multind: MultiIndex

	super: Summat
	init: (walkable?: IWalkable) => ITreeStream
	navigate: (position: MultiIndex) => IWalkable

	constructor(walkable?: IWalkable) {
		super()
		this.init(walkable)
	}
}

withSuper(TreeStream, TreeStreamBase, {
	multind,
	value,
	rewind: ConstDescriptor(rewind),
	navigate: ConstDescriptor(navigate),
	init: ConstDescriptor(init)
})
