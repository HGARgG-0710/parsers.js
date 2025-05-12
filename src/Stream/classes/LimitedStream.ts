import { boolean, type } from "@hgargg-0710/one"
import type { ILinkedStream, IPosition } from "../../interfaces/Stream.js"
import type { IUnderLimitedStream } from "../interfaces/LimitedStream.js"
import {
	directionCompare,
	positionEqual,
	positionNegate
} from "../utils/Position.js"
import { navigate } from "../../utils/Stream.js"
import { DyssyncStream } from "./WrapperStream.js"

const { isNullary } = type
const { T } = boolean

export function LimitedStream<Type = any>(
	from: IPosition,
	to?: IPosition
): new (resource?: IUnderLimitedStream<Type>) => ILinkedStream<Type> {
	if (isNullary(to)) {
		to = from
		from = LimitedStream.NoMovementPredicate
	}

	const negatedTo = positionNegate(to)
	const direction = directionCompare(from, negatedTo)

	return class extends DyssyncStream<Type> {
		private hasLookahead = false
		private hasLookbehind = false

		private lookbehind: Type
		private lookahead: Type

		declare resource?: IUnderLimitedStream<Type>

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
			if (this.isCurrEnd()) this.endStream()
			else this.baseNextIter(curr)
			return curr
		}

		prev() {
			const curr = this.curr
			this.isEnd = false
			if (this.isCurrStart()) this.startStream()
			else this.basePrevIter(curr)
			return curr
		}

		init(resource: IUnderLimitedStream<Type>) {
			super.init(resource)
			navigate(resource, from)
			this.hasLookahead = false
			this.hasLookbehind = false
			this.curr = resource.curr
			this.isEnd = resource.isEnd
			this.isStart = resource.isStart || true
			return this
		}

		constructor(resource?: IUnderLimitedStream<Type>) {
			super(resource)
		}
	}
}

export namespace LimitedStream {
	export const NoMovementPredicate = T
}
