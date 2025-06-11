import { MultiIndex } from "../classes/Position.js"
import type { IWalkable } from "../interfaces/Node.js"
import { hasChildren, treeEndPath } from "../utils/Node.js"

export class TreeWalker<TreeLike extends IWalkable<TreeLike> = IWalkable> {
	public readonly pos: MultiIndex = new MultiIndex()

	private _curr: TreeLike
	private level: TreeLike
	private walkable?: TreeLike

	private set curr(newCurr: TreeLike) {
		this._curr = newCurr
	}

	get curr() {
		return this._curr
	}

	getCurrChild() {
		const { level, pos } = this
		return (this.curr = level.read(pos.last()))
	}

	levelUp(positions: number = 1) {
		return (this.level = this.walkable!.backtrack(positions)!)
	}

	pushFirstChild() {
		this.pos.nextLevel()
		this.level = this.curr
		this.getCurrChild()
	}

	popChild() {
		this.pos.prevLevel()
		this.curr = this.level
		this.levelUp()
	}

	hasSiblingAfter() {
		return this.level.lastChild > this.pos.last()
	}

	hasSiblingBefore() {
		return this.pos.last() > 0
	}

	goSiblingAfter() {
		this.pos.incLast()
		this.getCurrChild()
	}

	goSiblingBefore() {
		this.pos.decLast()
		this.getCurrChild()
	}

	indexCut(length: number) {
		this.pos.resize(length)
		this.levelUp()
		this.getCurrChild()
	}

	hasChildren() {
		return hasChildren(this.curr)
	}

	hasParent() {
		return this.curr !== this.walkable
	}

	lastLevelWithSiblings() {
		return this.walkable!.findUnwalkedChildren(this.pos.get())
	}

	currentLastIndex() {
		return treeEndPath(this.curr)
	}

	goNextFirst(levelsUp: number) {
		this.indexCut(levelsUp)
		this.goSiblingAfter()
	}

	goPrevLast() {
		this.goSiblingBefore()
		const initLength = this.pos.levels
		this.pos.extend(this.currentLastIndex())
		this.renewLevel(this.curr, initLength)
	}

	renewLevel(init: IWalkable<TreeLike>, from: number) {
		return (this.level = init.index(this.pos.slice(from, -1)))
	}

	restart() {
		this.curr = this.level = this.walkable!
		this.pos.clear()
	}

	goIndex(pos?: MultiIndex) {
		if (pos) this.pos.from(pos)
		this.curr = this.walkable!.index(this.pos.get())
		this.levelUp()
	}

	init(walkable: TreeLike) {
		this.pos.clear()
		this.level = this.walkable = walkable
		return this
	}

	get() {
		return this.walkable
	}

	constructor(walkable?: TreeLike) {
		if (walkable) this.init(walkable)
	}
}
