import type { IMultiIndex } from "../../Position/MultiIndex/interfaces.js"
import type { TreeWalker } from "../../Tree/classes.js"

import { TreeStream } from "./classes.js"
import { superInit } from "../StreamClass/refactor.js"

import { defaults } from "../../constants.js"
const { response, lastLevelWithSiblings } = defaults.TreeStream

export namespace methods {
	export function baseNextIter<Type = any>(this: TreeStream<Type>) {
		const { walker, response } = this
		if (response) walker[response]()
		else {
			walker.indexCut(this.lastLevelWithSiblings + 1)
			walker.goSiblingAfter()
		}
	}

	export function rewind<Type = any>(this: TreeStream<Type>) {
		this.walker.restart()
		this.isStart = true
	}

	export function navigate<Type = any>(this: TreeStream<Type>, index: IMultiIndex) {
		this.walker.goIndex(index)
		return this.curr
	}

	export function basePrevIter<Type = any>(this: TreeStream<Type>) {
		const { walker, response } = this
		walker[response]()
	}

	export function currGetter<Type = any>(this: TreeStream<Type>) {
		return this.walker.curr
	}

	export function isCurrEnd<Type = any>(this: TreeStream<Type>) {
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

	export function isCurrStart<Type = any>(this: TreeStream<Type>) {
		const { walker } = this
		return !(this.response = walker.isSiblingBefore()
			? "goPrevLast"
			: walker.isParent()
			? "popChild"
			: "")
	}

	export namespace value {
		export function get<Type = any>(this: TreeStream<Type>) {
			return this.walker.get()!
		}
	}

	export namespace multind {
		export function get<Type = any>(this: TreeStream<Type>) {
			return this.walker.pos
		}
	}

	export function init<Type = any>(this: TreeStream<Type>, walker?: TreeWalker<Type>) {
		this.response = response
		this.lastLevelWithSiblings = lastLevelWithSiblings

		if (walker) {
			this.walker = walker
			superInit(this)
		}
		
		return this
	}
}
