import type { Summat } from "src/types/Summat.js"
import { sequentialIndex, type Tree } from "../../Tree.js"
import type { TreeStream } from "../TreeStream.js"

import { array, object } from "@hgargg-0710/one"
const { last } = array
const { structCheck } = object

export interface TreeWalker<Type = any> extends Summat {
	stream: TreeStream<Type>
	level: Tree<Type>
	pushFirstChild(): void
	popChild(): number[]
	isSiblingAfter(): boolean
	isSiblingBefore(): boolean
	goSiblingAfter(): number
	goSiblingBefore(): number
	indexCut(length: number): void
	isChild(): boolean
	isParent(): boolean
	lastLevelWithSiblings(): number
	currentLastIndex(): number[]
	goPrevLast(): void
	renewLevel(init?: Tree<Type>): void
	restart(): void
	goIndex(): void
}
export function treeWalkerRenewLevel<Type = any>(
	this: TreeWalker<Type>,
	init: Tree<Type> = this.stream.input
) {
	this.level = init.index(this.stream.pos.slice(0, -1)) as Tree<Type>
}

export function treeWalkerPushFirstChild<Type = any>(this: TreeWalker<Type>) {
	const index = this.stream.pos.modifier.nextLevel()
	this.level = this.stream.curr as Tree<Type>
	this.stream.curr = (this.stream.curr as Tree<Type>).index(index)
}

export function treeWalkerPopChild<Type = any>(this: TreeWalker<Type>) {
	const lastIndexed = this.stream.pos.modifier.prevLevel()
	this.stream.curr = this.level
	this.renewLevel()
	return lastIndexed
}

export function treeWalkerIsSiblingAfter<Type = any>(this: TreeWalker<Type>) {
	return (this.stream.curr as Tree<Type>).lastChild > last(this.stream.pos.lastLevel())
}

export function treeWalkerIsSiblingBefore<Type = any>(this: TreeWalker<Type>) {
	return !!last(this.stream.pos.lastLevel())
}

export function treeWalkerGoSiblingAfter<Type = any>(this: TreeWalker<Type>) {
	return this.stream.pos.modifier.incLast()
}

export function treeWalkerGoSiblingBefore<Type = any>(this: TreeWalker<Type>) {
	return this.stream.pos.modifier.decLast()
}

export function treeWalkerIndexCut<Type = any>(this: TreeWalker<Type>, length: number) {
	this.stream.pos.modifier.resize(length)
	this.renewLevel()
	this.stream.curr = this.level.index(this.stream.pos.lastLevel())
}

const childStruct = structCheck("lastChild")
export function treeWalkerCurrentLastIndex<Type = any>(this: TreeWalker<Type>) {
	const lastIndex: number[] = []
	let current = this.stream.curr as Tree<Type>
	while (childStruct(current.lastChild) && current.lastChild >= 0) {
		const { lastChild } = current
		lastIndex.push(lastChild)
		current = current.index([lastChild]) as Tree<Type>
	}
	return lastIndex
}

export function treeWalkerIsChild<Type = any>(this: TreeWalker<Type>) {
	return childStruct(this.stream.curr) && (this.stream.curr as Tree).lastChild >= 0
}

export function treeWalkerIsParent<Type = any>(this: TreeWalker<Type>) {
	return this.stream.curr !== this.stream.input
}

export function treeWalkerLastLevelWithSiblings<Type = any>(this: TreeWalker<Type>) {
	const { input, pos } = this.stream
	const parents = sequentialIndex(input, pos.slice(0, -1)) as Tree<Type>[]

	let result = parents.length - 1
	while (result >= 0 && parents[result].lastChild <= pos.slicer[result]) --result
	return result
}

export function treeWalkerGoPrevLast<Type = any>(this: TreeWalker<Type>) {
	this.stream.curr = this.level.index([this.goSiblingBefore()])
	this.stream.pos.modifier.extend(this.currentLastIndex())
	this.renewLevel(this.stream.curr as Tree<Type>)
}

export function treeWalkerRestart<Type = any>(this: TreeWalker<Type>) {
	this.stream.curr = this.level = this.stream.input
	this.stream.pos.modifier.clear()
}

export function treeWalkerGoIndex<Type = any>(this: TreeWalker<Type>) {
	this.stream.curr = this.stream.input.index(this.stream.pos.value)
	this.renewLevel()
}

// ! LATER, when implementing the 'TreeModifier', one'll NEED A WAY TO NOTIFY THE TreeWalker of CHANGES IN THE 'Tree'!
// ^ idea: use another property 'lastDidUpdate', which will influence the cached-'.lastIndex' re-calculation upon-reading;
export function TreeWalker<Type = any>(treeStream: TreeStream<Type>): TreeWalker<Type> {
	const root = treeStream.input
	return {
		stream: treeStream,
		level: root,
		pushFirstChild: treeWalkerPushFirstChild<Type>,
		popChild: treeWalkerPopChild<Type>,
		isSiblingAfter: treeWalkerIsSiblingAfter<Type>,
		isSiblingBefore: treeWalkerIsSiblingBefore<Type>,
		goSiblingAfter: treeWalkerGoSiblingAfter<Type>,
		goSiblingBefore: treeWalkerGoSiblingBefore<Type>,
		indexCut: treeWalkerIndexCut<Type>,
		isChild: treeWalkerIsChild<Type>,
		isParent: treeWalkerIsParent<Type>,
		lastLevelWithSiblings: treeWalkerLastLevelWithSiblings<Type>,
		currentLastIndex: treeWalkerCurrentLastIndex<Type>,
		goPrevLast: treeWalkerGoPrevLast<Type>,
		renewLevel: treeWalkerRenewLevel<Type>,
		restart: treeWalkerRestart<Type>,
		goIndex: treeWalkerGoIndex<Type>
	}
}
