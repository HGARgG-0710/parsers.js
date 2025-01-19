import type { MultiIndex } from "../../Position/MultiIndex/interfaces.js"
import type { MultiIndexModifier } from "src/Position/MultiIndex/interfaces.js"
import type { Tree, WalkableInTreeType } from "../interfaces.js"
import type { WalkableTree } from "./interfaces.js"

import { MultiIndex as MultiIndexClass } from "../../Position/MultiIndex/classes.js"
import { hasChildren, treeEndPath } from "../utils.js"
import { InitializablePattern } from "../../Pattern/abstract.js"

import { array } from "@hgargg-0710/one"
const { last } = array

const { MultiIndexModifier } = MultiIndexClass

export class TreeWalker<Type = any> extends InitializablePattern<WalkableTree<Type>> {
	level: WalkableTree<Type>
	curr: WalkableInTreeType<Type>
	pos: MultiIndex
	modifier: MultiIndexModifier

	getCurrChild() {
		const { level, pos } = this
		return (this.curr = level.index(pos.lastLevel()))
	}

	levelUp(positions: number = 1) {
		const { value, pos } = this
		return (this.level = value!.backtrack(positions, pos.get()) as WalkableTree<Type>)
	}

	pushFirstChild() {
		this.modifier.nextLevel()
		this.level = this.curr as WalkableTree<Type>
		this.getCurrChild()
	}

	popChild() {
		const lastIndexed = this.modifier.prevLevel()
		this.curr = this.level
		this.levelUp()
		return lastIndexed
	}

	isSiblingAfter() {
		return (this.curr as Tree<Type>).lastChild > last(this.pos.lastLevel())
	}

	isSiblingBefore() {
		return last(this.pos.lastLevel()) > 0
	}

	goSiblingAfter() {
		const res = this.modifier.incLast()
		this.getCurrChild()
		return res
	}

	goSiblingBefore() {
		const res = this.modifier.decLast()
		this.getCurrChild()
		return res
	}

	indexCut(length: number) {
		this.modifier.resize(length)
		this.levelUp()
		this.getCurrChild()
	}

	isChild() {
		return hasChildren(this.curr)
	}

	isParent() {
		return this.curr !== this.value
	}

	lastLevelWithSiblings() {
		const { value, pos } = this
		return value!.findUnwalkedChildren(pos.get())
	}

	currentLastIndex() {
		return treeEndPath(this.curr as Tree<Type>)
	}

	goPrevLast() {
		this.goSiblingBefore()
		const initLength = this.pos.levels
		this.modifier.extend(this.currentLastIndex())
		this.renewLevel(this.curr as WalkableTree<Type>, initLength)
	}

	renewLevel(init: WalkableTree<Type>, from: number, until: number = -1) {
		return (this.level = init.index(
			this.pos.slice(from, until)
		) as WalkableTree<Type>)
	}

	restart() {
		this.curr = this.level = this.value!
		this.modifier.clear()
	}

	goIndex(pos: MultiIndex) {
		this.pos = pos
		this.curr = this.value!.index(this.pos.get()!)
		this.levelUp()
	}

	init(value?: WalkableTree<Type>, pos?: MultiIndex, modifier?: MultiIndexModifier) {
		if (modifier) this.modifier = modifier

		if (value) {
			this.level = this.value = value
			if (!pos) this.modifier.clear()
		}

		if (pos) {
			this.modifier.init(pos)
			this.goIndex(pos)
		}

		return this
	}

	constructor(
		value?: WalkableTree<Type>,
		pos: MultiIndex = new MultiIndexClass(),
		modifier: MultiIndexModifier = new MultiIndexModifier()
	) {
		super(value)
		this.init(value, pos, modifier)
	}
}
