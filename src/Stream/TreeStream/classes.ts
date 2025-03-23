import type { Summat } from "@hgargg-0710/summat.ts"
import type { IInTree } from "../../Tree/interfaces.js"
import type { ITreeStream } from "./interfaces.js"

import type { Constructor } from "../StreamClass/refactor.js"
import type { IReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { MultiIndex } from "../../Position/classes.js"

import { withSuper } from "../../refactor.js"
import { TreeWalker } from "../../internal/TreeWalker/classes.js"
import { StreamClass } from "../StreamClass/classes.js"

import { BadIndex } from "../../constants.js"

import { boolean, object } from "@hgargg-0710/one"
const { F } = boolean
const { ConstDescriptor } = object.descriptor

import { methods } from "./methods.js"
const { rewind, navigate, init, value, multind, ...baseMethods } = methods

const TreeStreamBase = StreamClass({
	...baseMethods,
	defaultIsEnd: F
}) as Constructor<[], IReversedStreamClassInstance<IInTree>>

export class TreeStream<Type = any>
	extends TreeStreamBase
	implements ITreeStream<Type>
{
	protected response: string
	protected lastLevelWithSiblings = BadIndex
	protected walker: TreeWalker<Type>

	readonly multind: MultiIndex

	super: Summat
	navigate: (position: MultiIndex) => IInTree<Type>
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
