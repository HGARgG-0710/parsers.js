import type { InputStream } from "../InputStream/interfaces.js"
import type { EffectiveNestedStream } from "../NestedStream/interfaces.js"
import type { TransformedStream } from "../TransformedStream/interfaces.js"
import type { TreeStream } from "../TreeStream/interfaces.js"
import { uniFinish } from "../FinishableStream/utils.js"
import { type PositionalInputtedStream } from "../PositionalStream/interfaces.js"
import type { StreamTokenizer } from "../../Parser/StreamTokenizer/interfaces.js"
import type { BasicStream } from "./interfaces.js"

import { typeof as type } from "@hgargg-0710/one"
const { isFunction } = type

export function inputStreamNext<Type = any>(this: InputStream<Type>) {
	return this.input[++this.pos]
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

export function positionalStreamNext<Type = any>(
	this: PositionalInputtedStream<Type, number>
) {
	++this.pos
	return this.input.next()
}

export function streamTokenizerNext<Type = any>(this: StreamTokenizer<Type>) {
	const mapped = this.tokenMap(this.input)
	return isFunction(mapped) ? mapped.call(this, this.input) : mapped
}

export function transformedStreamNext<UnderType = any, UpperType = any>(
	this: TransformedStream<UnderType, UpperType>
) {
	const result = this.transform(this.input, this.pos)
	++this.pos
	return result
}

export function effectiveNestedStreamNext<Type = any>(this: EffectiveNestedStream<Type>) {
	if (this.currNested) {
		uniFinish(this.curr as BasicStream<Type>)
		this.currNested = false
	}
	if (this.inflate(this.input)) {
		this.currNested = true
		return this.input.nest(this.inflate, this.deflate)
	}
	return this.input.next()
}
