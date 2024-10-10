import type { Tree } from "../../Tree/interfaces.js"
import type { EffectiveTreeStream, TreeStream } from "./interfaces.js"

import { Inputted } from "../StreamClass/classes.js"
import { TreeStream as TreeStreamConstructor } from "./classes.js"

import type { MultiIndex as MultiIndexType } from "../../Position/MultiIndex/interfaces.js"
import { superInit } from "../StreamClass/utils.js"
import { StreamClass } from "../../constants.js"

export function effectiveTreeStreamNext<Type = any>(this: EffectiveTreeStream<Type>) {
	const { walker, response } = this

	if (response) walker[response]()
	else {
		walker.indexCut(this.lastLevelWithSiblings + 1)
		walker.goSiblingAfter()
	}

	return this.curr
}

export function effectiveTreeStreamRewind<Type = any>(this: EffectiveTreeStream<Type>) {
	this.walker.restart()
	this.isStart = StreamClass.PostCurrInit
	return this.curr
}

export function effectiveTreeStreamNavigate<Type = any>(
	this: EffectiveTreeStream<Type>,
	index: MultiIndexType
) {
	this.pos = index
	this.walker.goIndex()
	return this.curr
}

export function effectiveTreeStreamCopy<Type = any>(this: EffectiveTreeStream<Type>) {
	const copied = new TreeStreamConstructor(this.input)
	copied.navigate(this.pos)
	return copied
}

export function effectiveTreeStreamPrev<Type = any>(this: EffectiveTreeStream<Type>) {
	const { walker, response } = this
	walker[response]()
	return this.curr
}

export function treeStreamInitCurr<Type = any>(this: TreeStream<Type>) {
	return this.input
}

export function effectiveTreeStreamIsEnd<Type = any>(this: EffectiveTreeStream<Type>) {
	const { walker } = this
	this.response = walker.isChild()
		? "pushFirstChild"
		: walker.isSiblingAfter()
		? "goSiblingAfter"
		: ""
	return (
		!this.response &&
		(this.lastLevelWithSiblings = walker.lastLevelWithSiblings()) < 0
	)
}

export function effectiveTreeStreamIsStart<Type = any>(this: EffectiveTreeStream<Type>) {
	const { walker } = this
	return !(this.response = walker.isSiblingBefore()
		? "goPrevLast"
		: walker.isParent()
		? "popChild"
		: "")
}

export function effectiveTreeStreamInitialize<Type = any>(
	this: EffectiveTreeStream<Type>,
	tree?: Tree<Type>
) {
	if (tree) {
		Inputted(this, tree)
		this.pos.modifier.clear()
		this.walker.init(tree)
		superInit(this)
	}
	return this
}
