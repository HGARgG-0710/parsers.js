import type { IWalkable } from "../Node/interfaces.js"
import { hasChildren, treeEndPath } from "../Node/utils.js"
import { MultiIndex } from "../Stream/Position/classes.js"

export class TreeWalker<TreeLike extends IWalkable<TreeLike> = IWalkable> {
	level: TreeLike
	curr: TreeLike

	private walkable?: TreeLike
	private multind: MultiIndex = new MultiIndex()

	get pos() {
		return this.multind
	}

	getCurrChild() {
		const { level, pos } = this
		return (this.curr = level.read(pos.last()))
	}

	levelUp(positions: number = 1) {
		return (this.level = this.walkable!.backtrack(positions)!)
	}

	pushFirstChild() {
		this.multind.nextLevel()
		this.level = this.curr
		this.getCurrChild()
	}

	popChild() {
		this.multind.prevLevel()
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
		this.multind.incLast()
		this.getCurrChild()
	}

	goSiblingBefore() {
		this.multind.decLast()
		this.getCurrChild()
	}

	indexCut(length: number) {
		this.multind.resize(length)
		this.levelUp()
		this.getCurrChild()
	}

	isChild() {
		return hasChildren(this.curr)
	}

	isParent() {
		return this.curr !== this.walkable
	}

	lastLevelWithSiblings() {
		return this.walkable!.findUnwalkedChildren(this.pos.get())
	}

	currentLastIndex() {
		return treeEndPath(this.curr)
	}

	goPrevLast() {
		this.goSiblingBefore()
		const initLength = this.pos.levels
		this.multind.extend(this.currentLastIndex())
		this.renewLevel(this.curr, initLength)
	}

	renewLevel(init: IWalkable<TreeLike>, from: number) {
		return (this.level = init.index(this.pos.slice(from, -1)))
	}

	restart() {
		this.curr = this.level = this.walkable!
		this.multind.clear()
	}

	goIndex(pos?: MultiIndex) {
		if (pos) this.multind.from(pos)
		this.curr = this.walkable!.index(this.pos.get())
		this.levelUp()
	}

	init(walkable?: TreeLike) {
		if (walkable) {
			this.multind.clear()
			this.level = this.walkable = walkable
		}

		return this
	}

	get() {
		return this.walkable
	}

	constructor(walkable?: TreeLike) {
		this.init(walkable)
	}
}
