import type { Summat } from "./Summat.js"
import type { Tree } from "./Tree.js"

import { array, object } from "@hgargg-0710/one"
const { last, lastOut, clear } = array
const { structCheck } = object

export interface Indexable<Type> {
	[x: number]: Type
	length: number
}

export interface Stream<Type = any, EndType = any> extends Summat {
	curr(): Type | EndType
	next(): Type | EndType
	prev?(): Type
	isEnd(): boolean
	rewind?(): Type
	copy?(): Stream<Type>
}

export interface PositionalStream<Type = any, EndType = any>
	extends Stream<Type, EndType> {
	pos: number
}

export function InputStream<Type = any>(
	input: Indexable<Type>
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

// TODO [for the future]: add a 'prev' [can be done easily without changing existing stuff too much...];
// ^ NOTE: the 'prev' implementation is farily straightforward - it's just a reversed 'next' (going from 'bottom-to-top' and 'from-end-to-beginning'), so instead of checking for `0 in c.children()` and `last(...) + 1 in l.children()`, one checks for `l === tree` and `last(...) - 1 in l.children()`
// ! BUT one will also need to alter the 'next()', BECAUSE, both of them will now need to ALSO go down AND up the tree (one will additionally need to remember what was last not to 'skip' any "branches"...);
export function TreeStream<Type = any>(tree: Tree<Type>): Stream<Type | Tree<Type>, {}> {
	const multind = [0]
	const ENDVALUE = {}

	let currlevel = tree
	let current: Tree<Type> | Type | typeof ENDVALUE = currlevel.index(multind)

	const childStruct = structCheck("isChild")
	const nextLevel = (c: any): boolean =>
		childStruct(c) && typeof c.isChild === "function" && c.isChild(0)
	const isMore = (l: Tree<Type>): boolean => l.isChild(last(multind) + 1)

	return {
		next: function () {
			const prev = current
			if (nextLevel(current)) {
				multind.push(0)
				currlevel = current as Tree
				current = (current as Tree).index([0])
				return prev
			}
			while (multind.length && !isMore(currlevel)) {
				multind.pop()
				current = currlevel
				currlevel = tree.index(lastOut(multind)) as Tree
			}
			current = multind.length
				? currlevel.index([++multind[multind.length - 1]])
				: ENDVALUE
			return prev
		},
		curr: function () {
			return current
		},
		isEnd: function () {
			return current === ENDVALUE
		},
		rewind: function () {
			clear(multind)
			currlevel = tree
			current = tree
			return this.curr()
		}
	}
}
