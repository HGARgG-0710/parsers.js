import type { MultiIndex } from "../../Position/classes.js"
import type { IWalkable } from "../../Node/interfaces.js"

import { TreeStream } from "./classes.js"
import { BadIndex } from "../../constants.js"

export namespace methods {
	export function baseNextIter(this: TreeStream) {
		const { walker, response } = this
		if (response) walker[response]()
		else {
			walker.indexCut(this.lastLevelWithSiblings + 1)
			walker.goSiblingAfter()
		}
		return this.curr
	}

	export function rewind(this: TreeStream) {
		this.walker.restart()
		this.isStart = true
	}

	export function navigate(this: TreeStream, index: MultiIndex) {
		this.walker.goIndex(index)
		return this.curr
	}

	export function basePrevIter(this: TreeStream) {
		const { walker, response } = this
		walker[response]()
		return this.curr
	}

	export function currGetter(this: TreeStream) {
		return this.walker.curr
	}

	export function isCurrEnd(this: TreeStream) {
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

	export function isCurrStart(this: TreeStream) {
		const { walker } = this
		return !(this.response = walker.isSiblingBefore()
			? "goPrevLast"
			: walker.isParent()
			? "popChild"
			: "")
	}

	export namespace value {
		export function get(this: TreeStream) {
			return this.walker.get()!
		}
	}

	export namespace multind {
		export function get(this: TreeStream) {
			return this.walker.pos
		}
	}

	export function init(this: TreeStream, walkable?: IWalkable) {
		this.response = ""
		this.lastLevelWithSiblings = BadIndex

		if (walkable) {
			this.walker.init(walkable)
			this.super.init.call(this)
		}

		return this
	}
}
