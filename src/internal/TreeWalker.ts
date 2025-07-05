import type { IWalkable } from "../interfaces/Node.js"
import { hasChildren, treeEndPath } from "../utils/Node.js"
import { MultiIndex } from "./MultiIndex.js"

/**
 * This is the class responsible for providing the `DepthStream`
 * tree-iteration algorithm with its elementary operations. It
 * is used as an internal implementation detail, and can be used
 * to implement other tree-iteration algorithms.
 */
export class TreeWalker<TreeLike extends IWalkable<TreeLike> = IWalkable> {
	public readonly pos = new MultiIndex()

	private _curr: TreeLike
	private level: TreeLike
	private walkable?: TreeLike

	private set curr(newCurr: TreeLike) {
		this._curr = newCurr
	}

	get curr() {
		return this._curr
	}

	private levelUp(positions: number = 1) {
		return (this.level = this.walkable!.backtrack(positions)!)
	}

	private syncWithPos() {
		this.curr = this.walkable!.index(this.pos.get())
		this.levelUp()
	}

	private updatePos(withNew: number[]) {
		this.pos.from(withNew)
	}

	private getCurrChild() {
		const { level, pos } = this
		return (this.curr = level.read(pos.last!))
	}

	private goSiblingBefore() {
		this.pos.decLast()
		this.getCurrChild()
	}

	private indexCut(length: number) {
		this.pos.resize(length)
		this.levelUp()
		this.getCurrChild()
	}

	private currentLastIndex() {
		return treeEndPath(this.curr)
	}

	private renewLevel(init: IWalkable<TreeLike>, from: number) {
		return (this.level = init.index(this.pos.slice(from, -1)))
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
		return this.level.lastChild > this.pos.last!
	}

	hasSiblingBefore() {
		return this.pos.last! > 0
	}

	goSiblingAfter() {
		this.pos.incLast()
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

	goFirstNext(levelsUp: number) {
		this.indexCut(levelsUp)
		this.goSiblingAfter()
	}

	goLastPrev() {
		this.goSiblingBefore()
		const initLength = this.pos.levels
		this.pos.extend(this.currentLastIndex())
		this.renewLevel(this.curr, initLength)
	}

	restart() {
		this.curr = this.level = this.walkable!
		this.pos.clear()
	}

	goIndex(pos?: number[]) {
		if (pos) this.updatePos(pos)
		this.syncWithPos()
	}

	init(walkable: TreeLike) {
		this.walkable = walkable
		this.restart()
		return this
	}

	constructor(walkable?: TreeLike) {
		if (walkable) this.init(walkable)
	}
}
