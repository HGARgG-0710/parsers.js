import type { InputStream, PositionalStream, TreeStream } from "main.js"
import type { Summat } from "../Summat.js"
import type { PreBasicStream } from "./PreBasicStream.js"

export interface StreamIterable<Type = any> extends Summat {
	next(this: PreBasicStream<Type>): Type
}

export function inputStreamtNext<Type = any>(this: InputStream<Type>) {
	const prev = this.pos
	this.pos += +!this.isEnd
	return this.input[prev]
}

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

export function positionalStreamNext<Type = any>(this: PositionalStream<Type, number>) {
	if (!this.input.isEnd) ++this.pos
	return this.input.next()
}
