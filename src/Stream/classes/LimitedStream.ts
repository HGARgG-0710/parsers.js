import { boolean, type } from "@hgargg-0710/one"
import type {
	IPosition
} from "../interfaces.js"
import type { IUnderLimitedStream } from "../interfaces/LimitedStream.js"
import {
	directionCompare,
	positionEqual,
	positionNegate
} from "../Position/utils.js"
import { navigate } from "../utils.js"
import { WrapperStream } from "./WrapperStream.js"

const { isNullary } = type
const { T } = boolean

export function LimitedStream<Type = any>(
	from: IPosition,
	to?: IPosition
): new () => WrapperStream<Type> {
	if (isNullary(to)) {
		to = from
		from = LimitedStream.NoMovementPredicate
	}

	const negatedTo = positionNegate(to)
	const direction = directionCompare(from, negatedTo)

	class limitedStream extends WrapperStream<Type> {
		private hasLookahead = false
		private hasLookbehind = false

		private lookbehind: Type
		private lookahead: Type

		private _isStart: boolean = false
		private _isEnd: boolean = false

		private _curr: Type

		resource?: IUnderLimitedStream<Type>

		get isStart() {
			return this._isStart
		}

		set isStart(newIsStart: boolean) {
			this._isStart = newIsStart
		}

		get isEnd() {
			return this._isEnd
		}

		set isEnd(newIsEnd: boolean) {
			this._isEnd = newIsEnd
		}

		set curr(newCurr: Type) {
			this._curr = newCurr
		}

		get curr() {
			return this._curr
		}

		private syncCurr() {
			this.curr = this.resource!.curr
		}

		private prodForth() {
			const { hasLookahead, lookahead } = this
			if (!hasLookahead) {
				this.hasLookahead = true
				super[direction ? "next" : "prev"]()
				return this.curr
			}
			return lookahead
		}

		private prodBack() {
			const { hasLookbehind, lookbehind } = this
			if (!hasLookbehind) {
				this.hasLookbehind = true
				super[direction ? "prev" : "next"]()
				return this.curr
			}
			return lookbehind
		}

		private baseNextIter(curr: Type) {
			this.lookbehind = curr
			this.hasLookbehind = true
			this.hasLookahead = false
			this.syncCurr()
		}

		private basePrevIter(curr: Type) {
			this.lookahead = curr
			this.hasLookahead = true
			this.hasLookbehind = false
			this.syncCurr()
		}

		isCurrEnd(): boolean {
			if (this.resource!.isCurrEnd()) return true
			this.lookahead = this.prodForth()
			return positionEqual(this.resource!, negatedTo)
		}

		isCurrStart(): boolean {
			if (this.resource!.isCurrStart()) return true
			this.lookbehind = this.prodBack()
			return positionEqual(this.resource!, from)
		}

		next() {
			const curr = this.curr
			this.isStart = false
			if (this.isCurrEnd()) this.isEnd = true
			else this.baseNextIter(curr)
			return curr
		}

		prev() {
			const curr = this.curr
			this.isEnd = false
			if (this.isCurrStart()) this.isStart = true
			else this.basePrevIter(curr)
			return curr
		}

		init(resource: IUnderLimitedStream<Type>) {
			super.init(resource)
			navigate(resource, from)
			this.curr = resource.curr
			this.isEnd = resource.isEnd
			this.isStart = resource.isStart
			return this
		}

		constructor(resource?: IUnderLimitedStream<Type>) {
			super(resource)
		}
	}

	return limitedStream
}

export namespace LimitedStream {
	export const NoMovementPredicate = T
}
