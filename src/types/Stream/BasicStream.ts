import type { PreBasicStream } from "./PreBasicStream.js"
import { positionCheck } from "./Position.js"
import type { InputStream } from "./InputStream.js"
import type { LimitedStream } from "./LimitedStream.js"
import type { BaseNextable, Nextable } from "src/interfaces/BaseIterable.js"
import type { StreamTokenizer } from "src/parsers/StreamTokenizer.js"
import { unifinish, type PositionalInputtedStream, type TreeStream } from "main.js"

import { isEndable } from "../../interfaces/Endable.js"

import {
	isCurrable,
	isNextable,
	type IsEndCurrable,
	type IsStartCurrable
} from "src/interfaces.js"
import type { TransformedStream } from "./TransformedStream.js"

import { function as f, typeof as type } from "@hgargg-0710/one"
import type { BaseNestedStream, EffectiveNestedStream } from "./NestableStream.js"
const { isFunction } = type
const { and } = f

export interface BasicStream<Type = any> extends PreBasicStream<Type>, Nextable<Type> {}
export interface BaseStream<Type = any> extends BasicStream<Type>, IsEndCurrable {}
export interface ReverseBaseStream<Type = any>
	extends BasicStream<Type>,
		IsStartCurrable {}

export interface EssentialStream<Type = any>
	extends BaseStream<Type>,
		BaseNextable<Type> {}

export const isStream: (x: any) => x is BasicStream = and(
	isEndable,
	isCurrable,
	isNextable
) as (x: any) => x is BasicStream

export function inputStreamIsEnd<Type = any>(this: InputStream<Type>) {
	return this.pos >= this.input.length - 1
}

export function limitedStreamIsEnd<Type = any>(this: LimitedStream<Type>) {
	return this.input.isCurrEnd() || !positionCheck(this.input, this.to)
}

export function streamTokenizerIsEnd<Type = any>(this: StreamTokenizer<Type>) {
	return !this.curr
}

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
		unifinish(this.curr as BasicStream<Type>)
		this.currNested = false
	}
	if (this.inflate(this.input)) {
		this.currNested = true
		return this.input.nest(this.inflate, this.deflate)
	}
	return this.input.next()
}

export function baseNestedStreamIsEnd<Type = any>(this: BaseNestedStream<Type>) {
	return !!this.deflate() || this.input.isCurrEnd()
}
