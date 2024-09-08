import { TreeStream as TreeStreamConstructor } from "./classes.js"
import type { TreeStream } from "./interfaces.js"
import type { MultiIndex } from "./MultiIndex/interfaces.js"

export function treeStreamNext<Type = any>(this: TreeStream<Type>) {
	const { walker, response } = this

	if (response) walker[response]()
	else {
		walker.indexCut(this.lastLevelWithSiblings + 1)
		walker.goSiblingAfter()
	}

	return this.curr
}

export function treeStreamRewind<Type = any>(this: TreeStream<Type>) {
	this.walker.restart()
	this.isStart = true
	return this.curr
}

export function treeStreamNavigate<Type = any>(
	this: TreeStream<Type>,
	index: MultiIndex
) {
	this.pos = index
	this.walker.goIndex()
	return this.curr
}

export function treeStreamCopy<Type = any>(this: TreeStream<Type>) {
	const copied = TreeStreamConstructor(this.input)
	copied.navigate(this.pos)
	return copied
}

export function treeStreamPrev<Type = any>(this: TreeStream<Type>) {
	const { walker, response } = this
	walker[response]()
	return this.curr
}

export function treeStreamInitCurr<Type = any>(this: TreeStream<Type>) {
	return this.input
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

export * as TreeWalker from "./TreeWalker/methods.js"
export * as MultiIndex from "./MultiIndex/methods.js"
