import type { TreeWalker, WalkableTree } from "../../Tree/TreeWalker/interfaces.js"
import type { MultiIndex as MultiIndexType } from "../../Position/MultiIndex/interfaces.js"

import { TreeStream } from "./classes.js"
import { superInit } from "../StreamClass/utils.js"

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
	return this.walker.value
}

export function treeStreamMultindGetter<Type = any>(this: TreeStream<Type>) {
	return this.walker.pos
}

export function treeStreamInitialize<Type = any>(
	this: TreeStream<Type>,
	tree?: WalkableTree<Type>,
	walker?: TreeWalker<Type>
) {
	if (walker) this.walker = walker
	if (tree) {
		this.response = response
		this.lastLevelWithSiblings = lastLevelWithSiblings
		this.walker.init(tree)
		superInit(this)
	}
	return this
}
