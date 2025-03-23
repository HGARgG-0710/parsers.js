import type { MultiIndex } from "../../Position/classes.js"
import type { ITree, IInTree } from "../../Tree/interfaces.js"
import type { IWalkableTree } from "./interfaces.js"
import type { MultiIndexModifier } from "../MultiIndexModifier.js"

import { InitializablePattern } from "../Pattern.js"
import { hasChildren, treeEndPath } from "../../Tree/utils.js"

import { array } from "@hgargg-0710/one"
const { last } = array

export class TreeWalker<Type = any> extends InitializablePattern<
	IWalkableTree<Type>
> {
	level: IWalkableTree<Type>
	curr: IInTree<Type, IWalkableTree<Type>>
	modifier: MultiIndexModifier

	get pos() {
		return this.modifier.get()
	}

	getCurrChild() {
		const { level, pos } = this
		return (this.curr = level.index(pos.lastLevel()))
	}

	levelUp(positions: number = 1) {
		const { value, pos } = this
		return (this.level = value!.backtrack(
			positions,
			pos.get()
		) as IWalkableTree<Type>)
	}

	pushFirstChild() {
		this.modifier.nextLevel()
		this.level = this.curr as IWalkableTree<Type>
		this.getCurrChild()
	}

	popChild() {
		const lastIndexed = this.modifier.prevLevel()
		this.curr = this.level
		this.levelUp()
		return lastIndexed
	}

	isSiblingAfter() {
		return this.level.lastChild > last(this.pos.lastLevel())
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
		return treeEndPath(this.curr as ITree<Type>)
	}

	goPrevLast() {
		this.goSiblingBefore()
		const initLength = this.pos.levels
		this.modifier.extend(this.currentLastIndex())
		this.renewLevel(this.curr as IWalkableTree<Type>, initLength)
	}

	renewLevel(init: IWalkableTree<Type>, from: number, until: number = -1) {
		return (this.level = init.index(
			this.pos.slice(from, until)
		) as IWalkableTree<Type>)
	}

	restart() {
		this.curr = this.level = this.value!
		this.modifier.clear()
	}

	goIndex(pos?: MultiIndex) {
		if (pos) this.modifier.init(pos)
		this.curr = this.value!.index(this.pos.get()!)
		this.levelUp()
	}

	init(value?: IWalkableTree<Type>, modifier?: MultiIndexModifier) {
		if (modifier) {
			this.modifier = modifier
			if (value) this.goIndex()
		}

		if (value) this.level = this.value = value
		else if (!modifier) this.modifier.clear()

		return this
	}

	constructor(value?: IWalkableTree<Type>, modifier?: MultiIndexModifier) {
		super(value)
		this.init(value, modifier)
	}
}
