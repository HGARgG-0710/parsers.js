import { type SummatIterable } from "main.js"
import { isFunction, isNumber } from "../misc.js"
import type { Summat, SummatFunction } from "./Summat.js"
import type { Tree } from "./Tree.js"

import { array, object } from "@hgargg-0710/one"
const { last, lastOut, clear } = array
const { structCheck } = object

export type Indexed<Type = any> =
	| string
	| (Summat & {
			[x: number]: Type
			length: number
	  })

export interface BasicStream<Type = any, EndType = any> extends Summat {
	curr(): Type | EndType
	next(): Type | EndType
	isEnd(): boolean
}

export type PositionObject<Type = any> = {
	value: Type
	convert(): number
}

export type Position<Type = any> = SummatFunction | PositionObject<Type> | number

export interface PositionalStream<Type = any, EndType = any, PosType = any>
	extends BasicStream<Type, EndType> {
	pos: Position<PosType>
}

export interface ReversibleStream<Type = any, EndType = any>
	extends BasicStream<Type, EndType> {
	prev(): Type | EndType
	isStart?(): boolean
}

export interface RewindableStream<Type = any, EndType = any>
	extends BasicStream<Type, EndType> {
	rewind(): Type | EndType
}

export interface CopiableStream<Type = any, EndType = any>
	extends BasicStream<Type, EndType> {
	copy(): BasicStream<Type, EndType>
}

export type IterableStream<Type, EndType> = BasicStream<Type, EndType> &
	SummatIterable<Type>

export type PositionLimit = [Position, Position]
export interface NavigableStream<Type = any, EndType = any>
	extends BasicStream<Type, EndType> {
	navigate(position: Position): Type | EndType | void
}

export interface LimitableStream<Type = any, EndType = any>
	extends BasicStream<Type, EndType> {
	limit(from: Position, to?: Position): BasicStream<Type>
}

export function isPositionObject(x: any): x is PositionObject {
	return typeof x.convert === "function"
}

export function positionConvert(pos: Position) {
	return isPositionObject(pos) ? pos.convert() : pos
}

export function positionCheck(stream: PositionalStream, position: Position) {
	position = positionConvert(position)
	const converted = positionConvert(stream.pos)
	return isNumber(position)
		? isNumber(converted)
			? position < converted
			: converted(position)
		: position(stream)
}

export function positionCopy(x: Position): Position {
	return isPositionObject(x) ? { ...x } : x
}

export function positionalStreamNext() {
	++this.pos
	return this.input.next()
}

export function PositionalStream<Type = any, EndType = any>(
	substream: BasicStream<Type, EndType>
): PositionalStream<Type, EndType> {
	return {
		pos: 0,
		input: substream,
		next: positionalStreamNext,
		curr: underStreamCurr,
		isEnd: underStreamIsEnd
	}
}

export function inputStreamCurr() {
	return this.input[this.pos]
}

export function inputStreamtNext() {
	return this.input[this.pos++]
}

export function inputStreamtPrev() {
	return this.input[this.pos--]
}

export function inputStreamIsEnd() {
	return this.pos >= this.input.length
}

export function inputStreamRewind() {
	return this.input[(this.pos = 0)]
}
export function inputStreamCopy() {
	const inputStream = InputStream(this.input)
	inputStream.pos = this.pos
	return inputStream
}

export function inputStreamNavigate(i: number | SummatFunction) {
	if (isNumber(i)) return this.input[i]
	while (!i(this.input)) this.next()
	return this.input[this.pos]
}

export function* inputStreamIterator() {
	while (this.pos < this.input.length) {
		yield this.input[this.pos]
		++this.pos
	}
	return undefined
}

export function inputStreamIsStart() {
	return !this.pos
}

// ? [general idea]: use the global this-based functions + data fields instead of this (for purposes of potential memory-saving? No need to create function every time, only just to reference);
export function InputStream<Type = any>(
	input: Indexed<Type>
): PositionalStream<Type, undefined> &
	IterableStream<Type, undefined> &
	NavigableStream<Type, undefined> &
	ReversibleStream<Type, undefined> &
	RewindableStream<Type, undefined> &
	CopiableStream<Type, undefined> {
	return {
		input,
		pos: 0,
		curr: inputStreamCurr,
		next: inputStreamtNext,
		prev: inputStreamtPrev,
		isStart: inputStreamIsStart,
		isEnd: inputStreamIsEnd,
		rewind: inputStreamRewind,
		copy: inputStreamCopy,
		navigate: inputStreamNavigate,
		[Symbol.iterator]: inputStreamIterator
	}
}

// todo: REFACTOR... [the indexation and other repetative operations...];
// ^ IDEA: create a 'pos' (as in PositionalStream), for this thing - THEN, it'd be possible to, say, get an index of a given item in terms of number of iterations through the thing...;
export function TreeStream<Type = any>(
	tree: Tree<Type>
): RewindableStream<Tree<Type>, {}> &
	ReversibleStream<Tree<Type>, {}> &
	CopiableStream<Tree<Type>, {}> {
	// ! NOTE: this sort of 'internal state' PREVENTS one from properly refactoring the thing into 'this.'-based methods; If one keeps these as an 'available state', the user will be able to modify it... [which is largely undesired...];
	// THE VARIABLES THAT STAND IN THE WAY:
	// 1. ENDVALUE [hidden constant]
	// 2. lastMultind [hidden constant, not supposed to be changeable];
	let multind: number[] = []
	const ENDVALUE = {}

	let currlevel = tree
	let current: Tree<Type> | Type | typeof ENDVALUE = tree
	let lastItem: Tree<Type> | Type

	const childStruct = structCheck("lastChild")
	const nextLevel = (c: any): c is Tree<Type> =>
		childStruct(c) && isFunction(c.lastChild) && c.lastChild() >= 0

	const isParent = (c: any): boolean => c !== tree
	const isSibling = (): boolean => !!last(multind)

	const lastMultind = []
	let lastIterated: Tree<Type> | Type = tree
	while (nextLevel(lastIterated)) {
		const lastChild = lastIterated.lastChild()
		lastMultind.push(lastChild)
		lastIterated = lastIterated.index([lastChild])
	}

	return {
		pos: multind,
		next: function () {
			const prev = current
			if (prev === ENDVALUE) return prev

			lastItem = prev as Tree<Type> | Type
			if (nextLevel(current)) {
				multind.push(0)
				currlevel = current
				current = current.index([0])
				return prev
			}

			let result = Math.min(lastMultind.length, multind.length) - 1
			while (result >= 0 && lastMultind[result] <= multind[result]) --result
			if (result < 0) {
				current = ENDVALUE
				return prev
			}

			++multind[result]
			multind.length = result + 1
			currlevel = tree.index(lastOut(multind)) as Tree
			current = currlevel.index([last(multind)])
			return prev
		},
		prev: function () {
			const next = current
			if (current === ENDVALUE) {
				current = lastItem
				return next
			}
			lastItem = next as Tree<Type> | Type

			if (isSibling()) {
				const sibling = currlevel.index([--multind[multind.length - 1]])
				current = sibling
				const subind = []
				while (nextLevel(current)) {
					const lastChild = current.lastChild()
					subind.push(lastChild)
					current = current.index([lastChild])
				}
				multind.push(...subind)
				return next
			}

			if (isParent(current)) {
				multind.pop()
				current = currlevel
				currlevel = tree.index(lastOut(multind)) as Tree<Type>
			}

			return next
		},
		curr: function () {
			return current
		},
		isEnd: function () {
			return current === ENDVALUE
		},
		rewind: function () {
			clear(multind)
			currlevel = current = tree
			return this.curr()
		},
		copy: function () {
			const copy = TreeStream(tree)
			copy.pos = [...multind]
			return copy
		},
		isStart: function () {
			return current === tree
		}
	}
}

export function limitedStreamNavigate(position: Position) {
	position = positionConvert(position)
	return this.input.navigate(
		isNumber(position)
			? (positionConvert(this.input.pos) as number) + position
			: position
	)
}
export function underStreamNext() {
	return this.input.next()
}
export function underStreamCurr() {
	return this.input.curr()
}
export function underStreamIsEnd() {
	return this.input.isEnd()
}
export function limitedStreamIsEnd() {
	return !positionCheck(this.input, this.to) || this.input.isEnd()
}

export function LimitedStream<Type = any, EndType = any>(
	initialStream: NavigableStream<Type> & PositionalStream<Type>,
	from: Position,
	to?: Position
): NavigableStream<Type, EndType> &
	LimitableStream<Type, EndType> &
	PositionalStream<Type> {
	if (!to) {
		to = from
		from = null
	}
	if (from !== null) initialStream.navigate(from)
	return {
		pos: 0,
		to,
		input: initialStream,
		navigate: limitedStreamNavigate,
		next: underStreamNext,
		curr: underStreamCurr,
		isEnd: limitedStreamIsEnd,
		limit: limitStream
	}
}

export function limitStream<Type = any, EndType = any>(from: Position, to?: Position) {
	return LimitedStream<Type, EndType>(this, from, to)
}

export function LimitableStream<Type = any, EndType = any>(
	navigable: NavigableStream<Type, EndType> & PositionalStream<Type, EndType>
): LimitableStream<Type, EndType> &
	NavigableStream<Type, EndType> &
	PositionalStream<Type, EndType> {
	navigable.limit = limitStream
	return navigable as LimitableStream<Type, EndType> &
		NavigableStream<Type, EndType> &
		PositionalStream<Type, EndType>
}

export function ReversedStream<Type = any, EndType = any>(
	input: ReversibleStream<Type, EndType>
): ReversibleStream<Type, EndType> {
	while (!input.isEnd()) input.next()
	return {
		next: input.prev,
		prev: input.next,
		curr: input.curr,
		isEnd: input.isStart,
		isStart: input.isEnd
	}
}
