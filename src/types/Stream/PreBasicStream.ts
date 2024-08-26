import type { Summat } from "../Summat.js"
import type { TreeStream } from "./TreeStream.js"
import type { BasicStream } from "./BasicStream.js"

export interface PreBasicStream<Type = any> extends Summat {
	curr(this: PreBasicStream<Type>): Type
	next(this: PreBasicStream<Type>): Type
}

export function inputStreamCurr() {
	return this.input[this.pos]
}

export function inputStreamtNext() {
	const prev = this.pos
	this.pos += !this.isEnd
	return this.input[prev]
}
export function treeStreamCurr<Type = any>(this: TreeStream<Type>) {
	return this.walker.current
}
export function treeStreamNext<Type = any>(this: TreeStream<Type>) {
	const { walker } = this
	const prev = walker.current

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
export function positionalStreamNext(this: BasicStream) {
	if (!this.input.isEnd) ++this.pos
	return this.input.next()
}
