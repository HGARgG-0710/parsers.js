import type { IWalkable } from "../Node/interfaces.js"
import type { MultiIndex } from "../Position/classes.js"
import { MultiIndexModifier } from "./MultiIndexModifier.js"

import { InitializablePattern } from "./Pattern.js"
import { hasChildren, treeEndPath } from "../Node/utils.js"

import { array } from "@hgargg-0710/one"
const { last } = array

export class TreeWalker<
	Type extends IWalkable<Type> = any
> extends InitializablePattern<IWalkable<Type>> {
	level: IWalkable<Type>
	curr: IWalkable<Type>

	protected modifier: MultiIndexModifier = new MultiIndexModifier()

	get pos() {
		return this.modifier.get()
	}

	getCurrChild() {
		const { level, pos } = this
		return (this.curr = level.index(pos.lastLevel()))
	}

	levelUp(positions: number = 1) {
		const { value } = this
		return (this.level = value!.backtrack(positions)!)
	}

	pushFirstChild() {
		this.modifier.nextLevel()
		this.level = this.curr
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
		return treeEndPath(this.curr)
	}

	goPrevLast() {
		this.goSiblingBefore()
		const initLength = this.pos.levels
		this.modifier.extend(this.currentLastIndex())
		this.renewLevel(this.curr, initLength)
	}

	renewLevel(init: IWalkable<Type>, from: number) {
		return (this.level = init.index(this.pos.slice(from, -1)))
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

	init(walkable?: IWalkable<Type>) {
		if (walkable) {
			this.modifier.clear()
			this.level = this.value = walkable
		}

		return this
	}

	constructor(walkable?: IWalkable<Type>) {
		super(walkable)
		this.init(walkable)
	}
}
