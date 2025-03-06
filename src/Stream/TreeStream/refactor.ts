import type { IMultiIndex as MultiIndexType } from "../../Position/MultiIndex/interfaces.js"
import type { TreeWalker } from "../../Tree/classes.js"

import { TreeStream } from "./classes.js"
import { superInit } from "../StreamClass/refactor.js"

import { Stream, defaults } from "../../constants.js"
const { StreamClass } = Stream
const { response, lastLevelWithSiblings } = defaults.TreeStream

export function treeStreamNext<Type = any>(this: TreeStream<Type>) {
	const { walker, response } = this
	if (response) walker[response]()
	else {
		walker.indexCut(this.lastLevelWithSiblings + 1)
		walker.goSiblingAfter()
	}
}

export function treeStreamRewind<Type = any>(this: TreeStream<Type>) {
	this.walker.restart()
	this.isStart = StreamClass.PostCurrInit
}

export function treeStreamNavigate<Type = any>(
	this: TreeStream<Type>,
	index: MultiIndexType
) {
	this.walker.goIndex(index)
	return this.curr
}

export function treeStreamPrev<Type = any>(this: TreeStream<Type>) {
	const { walker, response } = this
	walker[response]()
}

export function treeStreamCurrGetter<Type = any>(this: TreeStream<Type>) {
	return this.walker.curr
}

export function treeStreamIsEnd<Type = any>(this: TreeStream<Type>) {
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

export function treeStreamIsStart<Type = any>(this: TreeStream<Type>) {
	const { walker } = this
	return !(this.response = walker.isSiblingBefore()
		? "goPrevLast"
		: walker.isParent()
		? "popChild"
		: "")
}

export function treeStreamValueGetter<Type = any>(this: TreeStream<Type>) {
	return this.walker.get()!
}

export function treeStreamMultindGetter<Type = any>(this: TreeStream<Type>) {
	return this.walker.pos
}

export function treeStreamInitialize<Type = any>(
	this: TreeStream<Type>,
	walker?: TreeWalker<Type>
) {
	this.response = response
	this.lastLevelWithSiblings = lastLevelWithSiblings
	if (walker) {
		this.walker = walker
		superInit(this)
	}
	return this
}
