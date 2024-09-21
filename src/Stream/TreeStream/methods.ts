import { TreeStream as TreeStreamConstructor } from "./classes.js"
import type { EffectiveTreeStream, TreeStream } from "./interfaces.js"
import type { MultiIndex } from "./MultiIndex/interfaces.js"

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
	this.isStart = true
	return this.curr
}

export function effectiveTreeStreamNavigate<Type = any>(
	this: EffectiveTreeStream<Type>,
	index: MultiIndex
) {
	this.pos = index
	this.walker.goIndex()
	return this.curr
}

export function effectiveTreeStreamCopy<Type = any>(this: EffectiveTreeStream<Type>) {
	const copied = TreeStreamConstructor(this.input)
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

export * as TreeWalker from "./TreeWalker/methods.js"
export * as MultiIndex from "./MultiIndex/methods.js"
