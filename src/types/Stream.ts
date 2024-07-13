import type { Iterable } from "main.js"
import { isFunction } from "../misc.js"
import type { Summat } from "./Summat.js"
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

export interface Position<Type = any> {
	value: Type
	convert(): number
}

export interface PositionalStream<Type = any, EndType = any, PosType = any>
	extends BasicStream<Type, EndType> {
	pos: Position<PosType> | number
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

export function isPosition(x: any): x is Position {
	return typeof x.convert === "function"
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

export function InputStream<Type = any>(
	input: Indexed<Type>
): PositionalStream<Type, undefined> & IterableStream<Type, undefined> {
	return {
		pos: 0,
		curr: function () {
			return input[this.pos]
		},
		next: function () {
			return input[this.pos++]
		},
		prev: function () {
			return input[this.pos--]
		},
		isEnd: function () {
			return this.pos >= input.length
		},
		rewind: function () {
			return input[(this.pos = 0)]
		},
		copy: function () {
			const inputStream = InputStream(input)
			inputStream.pos = this.pos
			return inputStream
		},
		[Symbol.iterator]: function* () {
			while (this.pos < input.length) {
				yield input[this.pos]
				++this.pos
			}
			return undefined
		}
	}
}

// todo: REFACTOR... [the indexation and other repetative operations...];
// ? Not sure one likes these 'backup'-s, and `lastItem`-s (and this kind of 'multind' modification... + memory wasting on `backup` values). See if one could do without them...;
// ^ IDEA: create a 'pos' (as in PositionalStream), for this thing - THEN, it'd be possible to, say, get an index of a given item in terms of number of iterations through the thing...;
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
