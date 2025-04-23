import type { IWalkable } from "../Node/interfaces.js"
import { hasChildren, treeEndPath } from "../Node/utils.js"
import type { MultiIndex } from "../Stream/Position/classes.js"
import { MultiIndexModifier } from "./MultiIndexModifier.js"
import { InitializablePattern } from "./Pattern.js"

export class TreeWalker<
	TreeLike extends IWalkable<TreeLike> = IWalkable
> extends InitializablePattern<TreeLike> {
	level: TreeLike
	curr: TreeLike

	private modifier: MultiIndexModifier = new MultiIndexModifier()

	get pos() {
		return this.modifier.get()
	}

	getCurrChild() {
		const { level, pos } = this
		return (this.curr = level.read(pos.last()))
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
		this.modifier.prevLevel()
		this.curr = this.level
		this.levelUp()
	}

	isSiblingAfter() {
		return this.level.lastChild > this.pos.last()
	}

	isSiblingBefore() {
		return this.pos.last() > 0
	}

	goSiblingAfter() {
		this.modifier.incLast()
		this.getCurrChild()
	}

	goSiblingBefore() {
		this.modifier.decLast()
		this.getCurrChild()
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

	renewLevel(init: IWalkable<TreeLike>, from: number) {
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

	init(walkable?: TreeLike) {
		if (walkable) {
			this.modifier.clear()
			this.level = this.value = walkable
		}

		return this
	}

	constructor(walkable?: TreeLike) {
		super(walkable)
		this.init(walkable)
	}
}
