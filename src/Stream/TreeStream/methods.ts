import { MultiIndex } from "../Position/classes.js"
import type { IWalkable } from "../../Node/interfaces.js"

import { TreeStream } from "./classes.js"
import { BadIndex } from "../../constants.js"
import { treeEndPath } from "../../Node/utils.js"

export namespace methods {
	export function baseNextIter<
		TreeLike extends IWalkable<TreeLike> = IWalkable
	>(this: TreeStream<TreeLike>) {
		const { walker, response } = this
		if (response) walker[response]()
		else {
			walker.indexCut(this.lastLevelWithSiblings + 1)
			walker.goSiblingAfter()
		}
		return this.curr
	}

	export function rewind<TreeLike extends IWalkable<TreeLike> = IWalkable>(
		this: TreeStream<TreeLike>
	) {
		this.walker.restart()
		this.isStart = true
	}

	export function navigate<TreeLike extends IWalkable<TreeLike> = IWalkable>(
		this: TreeStream<TreeLike>,
		index: MultiIndex
	) {
		this.walker.goIndex(index)
		return this.curr
	}

	export function basePrevIter<
		TreeLike extends IWalkable<TreeLike> = IWalkable
	>(this: TreeStream<TreeLike>) {
		const { walker, response } = this
		walker[response]()
		return this.curr
	}

	export function currGetter<
		TreeLike extends IWalkable<TreeLike> = IWalkable
	>(this: TreeStream<TreeLike>) {
		return this.walker.curr
	}

	export function isCurrEnd<TreeLike extends IWalkable<TreeLike> = IWalkable>(
		this: TreeStream<TreeLike>
	) {
		const { walker } = this
		this.response = walker.isChild()
			? "pushFirstChild"
			: walker.isSiblingAfter()
			? "goSiblingAfter"
			: ""
		return (
			!this.response &&
			(this.lastLevelWithSiblings = walker.lastLevelWithSiblings()) < 0
		)
	}

	export function isCurrStart<
		TreeLike extends IWalkable<TreeLike> = IWalkable
	>(this: TreeStream<TreeLike>) {
		const { walker } = this
		return !(this.response = walker.isSiblingBefore()
			? "goPrevLast"
			: walker.isParent()
			? "popChild"
			: "")
	}

	export namespace value {
		export function get<TreeLike extends IWalkable<TreeLike> = IWalkable>(
			this: TreeStream<TreeLike>
		) {
			return this.walker.get()!
		}
	}

	export namespace pos {
		export function get<TreeLike extends IWalkable<TreeLike> = IWalkable>(
			this: TreeStream<TreeLike>
		) {
			return this.walker.pos
		}
	}

	export function init<TreeLike extends IWalkable<TreeLike> = IWalkable>(
		this: TreeStream<TreeLike>,
		walkable?: TreeLike
	) {
		this.response = ""
		this.lastLevelWithSiblings = BadIndex

		if (walkable) {
			this.walker.init(walkable)
			this.endInd = new MultiIndex(treeEndPath(this.value))
			this.super.init.call(this)
		}

		return this
	}

	export function finish<TreeLike extends IWalkable<TreeLike> = IWalkable>(
		this: TreeStream<TreeLike>
	) {
		this.navigate(this.endInd)
		return this.curr
	}
}
