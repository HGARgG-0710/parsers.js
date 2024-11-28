import type {
	ChildrenTree as ChildrenTreeType,
	InTreeType,
	ParentTree
} from "./interfaces.js"

import type { WalkableTree } from "./TreeWalker/interfaces.js"

import { ChildrenTree } from "./classes.js"
import { isGoodIndex, lastIndex } from "../utils.js"
import { sequentialIndex } from "./utils.js"

export function childIndex<Type = any>(this: ChildrenTreeType<Type>, multind: number[]) {
	return multind.reduce((prev, curr) => prev.children[curr], this)
}

export function childrenCount<Type = any>(this: ChildrenTreeType<Type>): number {
	return lastIndex(this.children)
}

export function childrenGetter<Type = any>(this: ChildrenTree<Type>) {
	return this.value
}

export function childrenSetter<Type = any>(
	this: ChildrenTree<Type>,
	newChildren: InTreeType<Type>[]
) {
	return (this.value = newChildren)
}

export function parentTreeBacktrack<Type = any>(
	this: ParentTree<Type>,
	positions: number
) {
	let curr = this
	while (--positions) curr = curr.parent!
	return curr
}

export function parentTreeFindUnwalkedChildren<Type = any>(
	this: ParentTree<Type>,
	endInd: number[]
) {
	let result = lastIndex(endInd)
	let currTree = this
	while ((currTree = currTree.parent!) && currTree.lastChild <= endInd[result]) --result
	return result
}

export function trivialBacktrack<Type = any>(
	this: WalkableTree<Type>,
	positions: number,
	currInd: number[]
) {
	return this.index(currInd.slice(0, -positions))
}

export function trivialFindUnwalkedChildren<Type = any>(
	this: WalkableTree<Type>,
	endIndex: number[]
) {
	const parents = sequentialIndex(this, endIndex) as WalkableTree<Type>[]
	let result = lastIndex(parents)
	while (isGoodIndex(result) && parents[result].lastChild <= endIndex[result]) --result
	return result
}

export * as TreeWalker from "./TreeWalker/methods.js"
