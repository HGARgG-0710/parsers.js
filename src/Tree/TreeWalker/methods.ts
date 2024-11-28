import type { MultiIndex } from "../../Position/MultiIndex/interfaces.js"
import type { Tree } from "../interfaces.js"
import type { TreeWalker, WalkableTree } from "./interfaces.js"

import { setValue } from "../../Pattern/utils.js"
import { hasChildren, treeEndPath } from "../utils.js"

import { array } from "@hgargg-0710/one"
import type { MultiIndexModifier } from "../../Position/classes.js"
const { last } = array

export function treeWalkerGetCurrChild<Type = any>(this: TreeWalker<Type>) {
	const { level, pos } = this
	return (this.curr = level.index(pos.lastLevel()))
}

export function treeWalkerLevelUp<Type = any>(
	this: TreeWalker<Type>,
	positions: number = 1
) {
	const { value, pos } = this
	return (this.level = value!.backtrack(positions, pos.value) as WalkableTree<Type>)
}

export function treeWalkerPushFirstChild<Type = any>(this: TreeWalker<Type>) {
	this.modifier.nextLevel()
	this.level = this.curr as WalkableTree<Type>
	this.getCurrChild()
}

export function treeWalkerPopChild<Type = any>(this: TreeWalker<Type>) {
	const lastIndexed = this.modifier.prevLevel()
	this.curr = this.level
	this.levelUp()
	return lastIndexed
}

export function treeWalkerIsSiblingAfter<Type = any>(this: TreeWalker<Type>) {
	return (this.curr as Tree<Type>).lastChild > last(this.pos.lastLevel())
}

export function treeWalkerIsSiblingBefore<Type = any>(this: TreeWalker<Type>) {
	return last(this.pos.lastLevel()) > 0
}

export function treeWalkerGoSiblingAfter<Type = any>(this: TreeWalker<Type>) {
	const res = this.modifier.incLast()
	this.getCurrChild()
	return res
}

export function treeWalkerGoSiblingBefore<Type = any>(this: TreeWalker<Type>) {
	const res = this.modifier.decLast()
	this.getCurrChild()
	return res
}

export function treeWalkerIndexCut<Type = any>(this: TreeWalker<Type>, length: number) {
	this.modifier.resize(length)
	this.levelUp()
	this.getCurrChild()
}

export function treeWalkerCurrentLastIndex<Type = any>(this: TreeWalker<Type>) {
	return treeEndPath(this.curr as Tree<Type>)
}

export function treeWalkerIsChild<Type = any>(this: TreeWalker<Type>) {
	return hasChildren(this.curr)
}

export function treeWalkerIsParent<Type = any>(this: TreeWalker<Type>) {
	return this.curr !== this.value
}

export function treeWalkerLastLevelWithSiblings<Type = any>(this: TreeWalker<Type>) {
	const { value, pos } = this
	return value!.findUnwalkedChildren(pos.slice(0, -1))
}

export function treeWalkerGoPrevLast<Type = any>(this: TreeWalker<Type>) {
	this.goSiblingBefore()
	const initLength = this.pos.levels
	this.modifier.extend(this.currentLastIndex())
	this.renewLevel(this.curr as WalkableTree<Type>, initLength)
}

export function treeWalkerRenewLevel<Type = any>(
	this: TreeWalker<Type>,
	init: WalkableTree<Type>,
	from: number,
	until: number = -1
) {
	return (this.level = init.index(this.pos.slice(from, until)) as WalkableTree<Type>)
}

export function treeWalkerRestart<Type = any>(this: TreeWalker<Type>) {
	this.curr = this.level = this.value!
	this.modifier.clear()
}

export function treeWalkerGoIndex<Type = any>(this: TreeWalker<Type>, pos: MultiIndex) {
	this.pos = pos
	this.curr = this.value!.index(pos.value!)
	this.levelUp()
}

export function treeWalkerInitialize<Type = any>(
	this: TreeWalker<Type>,
	value?: WalkableTree<Type>,
	pos?: MultiIndex,
	modifier?: MultiIndexModifier
) {
	if (modifier) this.modifier = modifier
	if (value) {
		this.level = setValue(this, value)!
		if (!pos) this.modifier.clear()
	}
	if (pos) {
		this.modifier.init(pos)
		this.goIndex(pos)
	}
	return this
}
