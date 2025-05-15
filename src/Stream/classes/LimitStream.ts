import { boolean, type } from "@hgargg-0710/one"
import type { ILinkedStream, IPosition } from "../../interfaces/Stream.js"
import { maybeInit } from "../../utils.js"
import { navigate } from "../../utils/Stream.js"
import type { IUnderLimitedStream } from "../interfaces/LimitStream.js"
import {
	directionCompare,
	positionBind,
	positionEqual,
	positionNegate
} from "../utils/Position.js"
import { DyssyncStream } from "./WrapperStream.js"

const { isNullary } = type
const { T } = boolean

class _LimitStream<Type = any> extends DyssyncStream<Type> {
	private hasLookahead = false
	private hasLookbehind = false

	private lookbehind: Type
	private lookahead: Type

	private direction: boolean
	private from: IPosition
	private until: IPosition

	resource?: IUnderLimitedStream<Type>

	private prodForth() {
		const { hasLookahead, lookahead } = this
		return hasLookahead ? lookahead : this.prodForthWithoutLookahead()
	}

	private prodForthWithoutLookahead() {
		this.hasLookahead = true
		super[this.pickForwardDirection()]()
		return this.curr
	}

	private pickForwardDirection() {
		return this.direction ? "next" : "prev"
	}

	private prodBack() {
		const { hasLookbehind, lookbehind } = this
		return hasLookbehind ? lookbehind : this.prodBackWithoutLookbehind()
	}

	private prodBackWithoutLookbehind() {
		this.hasLookbehind = true
		super[this.pickBackwardDirection()]()
		return this.curr
	}

	private pickBackwardDirection() {
		return this.direction ? "prev" : "next"
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
		return positionEqual(this.resource!, this.until)
	}

	isCurrStart(): boolean {
		if (this.resource!.isCurrStart()) return true
		this.lookbehind = this.prodBack()
		return positionEqual(this.resource!, this.from)
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
		navigate(resource, this.from)
		this.hasLookahead = false
		this.hasLookbehind = false
		this.curr = resource.curr
		this.isEnd = resource.isEnd
		this.isStart = resource.isStart || true
		return this
	}

	setFrom(from: IPosition) {
		this.from = positionBind(this, from)
		return this
	}

	setUntil(until: IPosition) {
		this.until = positionBind(this, until)
		return this
	}

	setDirection(direction: boolean) {
		this.direction = direction
		return this
	}

	constructor(resource?: IUnderLimitedStream<Type>) {
		super(resource)
	}
}

export function LimitStream<Type = any>(
	from: IPosition<Type>,
	longAs?: IPosition<Type>
) {
	if (isNullary(longAs)) {
		longAs = from
		from = LimitStream.NoMovementPredicate
	}

	const until = positionNegate(longAs)
	const direction = directionCompare(from, until)

	return function (
		resource?: IUnderLimitedStream<Type>
	): ILinkedStream<Type> {
		return maybeInit(
			new _LimitStream()
				.setDirection(direction)
				.setFrom(from)
				.setUntil(until),
			resource
		)
	}
}

export namespace LimitStream {
	export const NoMovementPredicate = T
}
