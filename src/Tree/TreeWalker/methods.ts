import type { MultiIndex } from "../../Position/MultiIndex/interfaces.js"
import type { Tree } from "../interfaces.js"
import type { TreeWalker } from "./interfaces.js"

import { setValue } from "../../Pattern/utils.js"
import { sequentialIndex } from "../utils.js"

import { array, object, function as f } from "@hgargg-0710/one"
const { last } = array
const { structCheck } = object
const { id } = f

export function treeWalkerRenewLevel<Type = any>(
	this: TreeWalker<Type>,
	init: Tree<Type> = this.value,
	from: number = 0,
	until: number = -1
) {
	this.level = init.index(this.pos.slice(from, until)) as Tree<Type>
}

export function treeWalkerPushFirstChild<Type = any>(this: TreeWalker<Type>) {
	const index = this.modifier.nextLevel()
	this.level = this.curr as Tree<Type>
	this.curr = (this.curr as Tree<Type>).index(index)
}

export function treeWalkerPopChild<Type = any>(this: TreeWalker<Type>) {
	const lastIndexed = this.modifier.prevLevel()
	this.curr = this.level
	this.renewLevel()
	return lastIndexed
}

export function treeWalkerIsSiblingAfter<Type = any>(this: TreeWalker<Type>) {
	return (this.curr as Tree<Type>).lastChild > last(this.pos.lastLevel())
}

export function treeWalkerIsSiblingBefore<Type = any>(this: TreeWalker<Type>) {
	return !!last(this.pos.lastLevel())
}

export function treeWalkerGoSiblingAfter<Type = any>(this: TreeWalker<Type>) {
	return this.modifier.incLast()
}

export function treeWalkerGoSiblingBefore<Type = any>(this: TreeWalker<Type>) {
	return this.modifier.decLast()
}

export function treeWalkerIndexCut<Type = any>(this: TreeWalker<Type>, length: number) {
	this.modifier.resize(length)
	this.renewLevel()
	this.curr = this.level.index(this.pos.lastLevel())
}

const childStruct = structCheck({ lastChild: id })
export function treeWalkerCurrentLastIndex<Type = any>(this: TreeWalker<Type>) {
	const lastIndex: number[] = []
	let current = this.curr as Tree<Type>
	while (childStruct(current) && current.lastChild >= 0) {
		const { lastChild } = current
		lastIndex.push(lastChild)
		current = current.index([lastChild]) as Tree<Type>
	}
	return lastIndex
}

export function treeWalkerIsChild<Type = any>(this: TreeWalker<Type>) {
	return childStruct(this.curr) && (this.curr as Tree).lastChild >= 0
}

export function treeWalkerIsParent<Type = any>(this: TreeWalker<Type>) {
	return this.curr !== this.value
}

export function treeWalkerLastLevelWithSiblings<Type = any>(this: TreeWalker<Type>) {
	const { input, pos } = this
	const sliced = pos.slice(0, -1)
	const parents = sequentialIndex(input, sliced) as Tree<Type>[]

	let result = parents.length - 1
	while (result >= 0 && parents[result].lastChild <= sliced[result]) --result
	return result
}

export function treeWalkerGoPrevLast<Type = any>(this: TreeWalker<Type>) {
	this.curr = this.level.index([this.goSiblingBefore()])
	const initLength = this.pos.levels
	this.modifier.extend(this.currentLastIndex())
	this.renewLevel(this.curr as Tree<Type>, initLength)
}

export function treeWalkerRestart<Type = any>(this: TreeWalker<Type>) {
	this.curr = this.level = this.value
	this.modifier.clear()
}

export function treeWalkerGoIndex<Type = any>(this: TreeWalker<Type>, pos: MultiIndex) {
	this.pos = pos
	this.curr = this.value.index(pos.value)
	this.renewLevel()
}

export function treeWalkerInitialize<Type = any>(
	this: TreeWalker<Type>,
	input?: Tree<Type>,
	pos?: MultiIndex
) {
	if (input) {
		this.level = setValue(this, input)
		if (!pos) this.modifier.clear()
	}
	if (pos) {
		this.modifier.init(pos)
		this.goIndex(pos)
	}
	return this
}
