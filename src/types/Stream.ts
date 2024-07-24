import { type Iterable } from "main.js"
import { isFunction, isNumber, predicateChoice } from "../misc.js"
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
	Iterable<Type, EndType>

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
		: position(converted)
}

export function PositionalStream<Type = any, EndType = any>(
	substream: BasicStream<Type, EndType>
): PositionalStream<Type, EndType> {
	return {
		pos: 0,
		next: function () {
			++this.pos
			return substream.next()
		},
		curr: function () {
			return substream.curr()
		},
		isEnd: function () {
			return substream.isEnd()
		}
	}
}

export function inputCurr() {
	return this.input[this.pos]
}

export function inputNext() {
	return this.input[this.pos++]
}

export function inputPrev() {
	return this.input[this.pos--]
}

export function inputIsEnd() {
	return this.pos >= this.input.length
}

export function inputRewind() {
	return this.input[(this.pos = 0)]
}
export function inputCopy() {
	const inputStream = InputStream(this.input)
	inputStream.pos = this.pos
	return inputStream
}

export function inputNavigate(i: number) {
	return this.input[i]
}

export function inputIterator() {
	return function* () {
		while (this.pos < this.input.length) {
			yield this.input[this.pos]
			++this.pos
		}
		return undefined
	}
}

export function inputIsStart() {
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
		curr: inputCurr,
		next: inputNext,
		prev: inputPrev,
		isStart: inputIsStart,
		isEnd: inputIsEnd,
		rewind: inputRewind,
		copy: inputCopy,
		navigate: inputNavigate,
		[Symbol.iterator]: inputIterator()
	}
}

// todo: REFACTOR... [the indexation and other repetative operations...];
// ? Not sure one likes these 'backup'-s, and `lastItem`-s (and this kind of 'multind' modification... + memory wasting on `backup` values). See if one could do without them...;
// ^ IDEA: create a 'pos' (as in PositionalStream), for this thing - THEN, it'd be possible to, say, get an index of a given item in terms of number of iterations through the thing...;
// ! Add 'isStart';
export function TreeStream<Type = any>(
	tree: Tree<Type>
): RewindableStream<Tree<Type>, {}> &
	ReversibleStream<Tree<Type>, {}> &
	CopiableStream<Tree<Type>, {}> {
	let multind = []
	let backup: number[] = []
	const ENDVALUE = {}

	let currlevel = tree
	let current: Tree<Type> | Type | typeof ENDVALUE = tree
	let lastItem: Tree<Type> | Type

	const childStruct = structCheck("lastChild")
	const nextLevel = (c: any): c is Tree<Type> =>
		childStruct(c) && isFunction(c.lastChild) && c.lastChild() >= 0
	const isMore = (l: Tree<Type>): boolean => l.lastChild() >= last(multind) + 1

	const isParent = (c: any): boolean => c !== tree
	const isSibling = (): boolean => !!last(multind)

	return {
		pos: multind,
		next: function () {
			const prev = current
			lastItem = prev === ENDVALUE ? lastItem : (prev as Tree<Type> | Type)
			if (nextLevel(current)) {
				multind.push(0)
				currlevel = current
				current = current.index([0])
				return prev
			}
			if (multind.length) backup = [...multind]
			while (multind.length && !isMore(currlevel)) {
				multind.pop()
				current = currlevel
				currlevel = tree.index(lastOut(multind)) as Tree<Type>
			}
			current = multind.length
				? currlevel.index([++multind[multind.length - 1]])
				: ENDVALUE
			return prev
		},
		prev: function () {
			const lastcurr = current
			if (lastItem && current === ENDVALUE) {
				multind = backup
				current = lastItem
				return lastcurr
			}
			lastItem = lastcurr as Tree<Type> | Type

			if (isSibling()) {
				const sibling = currlevel.index([--multind[multind.length - 1]])
				current = sibling
				let [isLevel, isFurther] = Array(2).fill(false)
				if (nextLevel(current))
					while (
						(isLevel = nextLevel(current)) ||
						(isFurther = isMore(currlevel))
					) {
						if (isLevel) {
							multind.push(0)
							currlevel = current as Tree<Type>
							current = (current as Tree<Type>).index([last(multind)])
							continue
						}
						if (isFurther)
							current = currlevel.index([
								(multind[multind.length - 1] = currlevel.lastChild())
							])
					}
				return lastcurr
			}

			if (isParent(current)) {
				multind.pop()
				current = currlevel
				currlevel = tree.index(lastOut(multind)) as Tree<Type>
			}

			return lastcurr
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
		}
	}
}

export function LimitedStream<Type, EndType>(
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
		navigate: function (position: Position) {
			position = positionConvert(position)
			return this.input.navigate(
				isNumber(position)
					? (positionConvert(this.input.pos) as number) + position
					: position
			)
		},
		next: function () {
			return this.input.next()
		},
		curr: function () {
			return this.input.curr()
		},
		isEnd: function () {
			return !positionCheck(this.input, this.to) || this.input.isEnd()
		},
		limit: function (from: Position, to?: Position) {
			return LimitedStream<Type, EndType>(this, from, to)
		}
	}
}

export function limitStream(from: Position, to?: Position) {
	return LimitedStream(this, from, to)
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
	return {
		next: input.prev,
		prev: input.next,
		curr: input.curr,
		isEnd: input.isStart,
		isStart: input.isEnd
	}
}
