import { isFunction } from "../misc.js"
import type { Summat } from "./Summat.js"
import type { RecursiveTree, Tree } from "./Tree.js"

import { array, object } from "@hgargg-0710/one"
const { last, lastOut, clear } = array
const { structCheck } = object

export interface Indexable<Type> extends Summat {
	[x: number]: Type
	length: number
}

export interface Stream<Type = any, EndType = any> extends Summat {
	curr(): Type | EndType
	next(): Type | EndType
	prev?(): Type | EndType
	isEnd(): boolean
	rewind?(): Type | EndType
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

// todo: REFACTOR... [the indexation and other repetative operations...];
export function TreeStream<Type = any>(
	tree: RecursiveTree<Type>
): Stream<RecursiveTree<Type>, {}> {
	const multind = [0]
	const ENDVALUE = {}

	let currlevel = tree
	let current: RecursiveTree<Type> | Type | typeof ENDVALUE = currlevel.index(multind)

	const childStruct = structCheck("lastChild")
	const nextLevel = (c: any): c is RecursiveTree<Type> =>
		childStruct(c) && isFunction(c.lastChild) && c.lastChild() >= 0
	const isMore = (l: RecursiveTree<Type>): boolean => l.lastChild() >= last(multind) + 1

	const isParent = (c: any): boolean => c !== tree
	const isSibling = (): boolean => !!last(multind)

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
		prev: function () {
			const lastcurr = current

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
							currlevel = current as RecursiveTree<Type>
							current = (current as RecursiveTree<Type>).index([
								last(multind)
							])
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
				currlevel = tree.index(lastOut(multind)) as Tree
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
			currlevel = tree
			current = tree
			return this.curr()
		}
	}
}
