import { isFunction } from "../misc.js"
import type { Summat } from "./Summat.js"
import type { Tree } from "./Tree.js"

import { array, object } from "@hgargg-0710/one"
const { last, lastOut, clear } = array
const { structCheck } = object

export interface Indexed<Type = any> extends Summat {
	[x: number]: Type
	length: number
}

export interface Stream<Type = any, EndType = any> extends Summat {
	curr(): Type | EndType
	next(): Type | EndType
	prev?(): Type | EndType
	isEnd(): boolean
	rewind?(): Type | EndType
	copy?(): Stream<Type, EndType>
}

export interface PositionalStream<Type = any, EndType = any>
	extends Stream<Type, EndType> {
	pos: number
}

export function InputStream<Type = any>(
	input: Indexed<Type>
): PositionalStream<Type, undefined> {
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
		}
	}
}

// todo: REFACTOR... [the indexation and other repetative operations...];
// TODO: add a 'copy()'
// ? Not sure one likes these 'backup'-s, and `lastItem`-s (and this kind of 'multind' modification... + memory wasting on `backup` values). See if one could do without them...;
export function TreeStream<Type = any>(tree: Tree<Type>): Stream<Tree<Type>, {}> {
	let multind = [0]
	let backup: number[] = []
	const ENDVALUE = {}

	let currlevel = tree
	let current: Tree<Type> | Type | typeof ENDVALUE = currlevel.index(multind)
	let lastItem: Tree<Type> | Type

	const childStruct = structCheck("lastChild")
	const nextLevel = (c: any): c is Tree<Type> =>
		childStruct(c) && isFunction(c.lastChild) && c.lastChild() >= 0
	const isMore = (l: Tree<Type>): boolean => l.lastChild() >= last(multind) + 1

	const isParent = (c: any): boolean => c !== tree
	const isSibling = (): boolean => !!last(multind)

	return {
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
				if (nextLevel(current)) {
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
				}
				return lastcurr
			}

			if (isParent(current)) {
				multind.pop()
				current = currlevel
				currlevel = tree.index(lastOut(multind)) as Tree<Type>
				return lastcurr
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
		}
	}
}
