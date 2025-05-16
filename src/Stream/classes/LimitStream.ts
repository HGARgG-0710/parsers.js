import { boolean, type } from "@hgargg-0710/one"
import { ownerInitializer } from "../../classes/Initializer.js"
import type { ILinkedStream, IPosition } from "../../interfaces/Stream.js"
import { navigate } from "../../utils/Stream.js"
import type { ILimitableStream } from "../interfaces/LimitStream.js"
import {
	directionCompare,
	positionBind,
	positionEqual,
	positionNegate
} from "../utils/Position.js"
import { DyssyncStream } from "./WrapperStream.js"

const { isNullary } = type
const { T } = boolean

const limitedStreamInitializer = {
	init(target: _LimitStream, resource: ILimitableStream) {
		target.setupState()
		ownerInitializer.init(target, resource)
		if (resource) this.setupUnderStream(target)
	}
}

class _LimitStream<Type = any> extends DyssyncStream<Type> {
	private hasLookahead = false
	private hasLookbehind = false

	private lookbehind: Type
	private lookahead: Type

	private direction: boolean
	private from: IPosition
	private until: IPosition

	protected get initializer() {
		return limitedStreamInitializer
	}

	resource?: ILimitableStream<Type>

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

	private forgetLastLookahead() {
		this.hasLookahead = false
	}

	private forgetLastLookbehind() {
		this.hasLookbehind = false
	}

	private findStartPos() {
		navigate(this.resource!, this.from)
	}

	setupUnderStream() {
		this.findStartPos()
		this.syncCurr()
	}

	setupState() {
		this.forgetLastLookahead()
		this.forgetLastLookbehind()
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

	syncCurr(): void {
		super.syncCurr()
	}

	init(resource?: ILimitableStream<Type>) {
		return super.init(resource)
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

	constructor(resource?: ILimitableStream<Type>) {
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

	return function (resource?: ILimitableStream<Type>): ILinkedStream<Type> {
		return new _LimitStream()
			.setDirection(direction)
			.setFrom(from)
			.setUntil(until)
			.init(resource)
	}
}

export namespace LimitStream {
	export const NoMovementPredicate = T
}
