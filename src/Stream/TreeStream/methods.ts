import { TreeStream as TreeStreamConstructor } from "./classes.js"
import type { TreeStream } from "./interfaces.js"
import type { MultiIndex } from "./MultiIndex/interfaces.js"

export function treeStreamNext<Type = any>(this: TreeStream<Type>) {
	const { walker, curr } = this
	const prev = curr

	if (!this.isEnd)
		if (walker.isChild()) walker.pushFirstChild()
		else if (walker.isSiblingAfter()) walker.goSiblingAfter()
		else {
			const searchResult = walker.lastLevelWithSiblings()
			if (searchResult < 0) this.isEnd = true
			else {
				walker.indexCut(searchResult + 1)
				walker.goSiblingAfter()
			}
		}

	return prev
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

export function treeStreamIsStartGetter<Type = any>(this: TreeStream<Type>) {
	return !this.walker.isParent()
}

export function treeStreamPrev<Type = any>(this: TreeStream<Type>) {
	const { walker } = this
	this.isEnd = false
	if (walker.isSiblingBefore()) walker.goPrevLast()
	else if (walker.isParent()) walker.popChild()
	return this.curr
}

export * as TreeWalker from "./TreeWalker/methods.js"
export * as MultiIndex from "./MultiIndex/methods.js"
