import { boolean, type } from "@hgargg-0710/one"
import { ownerInitializer } from "../../../classes/Initializer.js"
import type { ILinkedStream, IPosition } from "../../../interfaces/Stream.js"
import { navigate } from "../../../utils/Stream.js"
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

const limitStreamInitializer = {
	init(target: _LimitStream, resource?: ILimitableStream) {
		target.setupState()
		ownerInitializer.init(target, resource)
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
		return limitStreamInitializer
	}

	protected set resource(newResource: ILimitableStream<Type>) {
		super.resource = newResource
	}

	get resource() {
		return super.resource as ILimitableStream<Type>
	}

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

	setResource(resource: ILimitableStream<Type>) {
		super.setResource(resource)
		this.findStartPos()
		this.syncCurr()
	}

	setupState() {
		this.forgetLastLookahead()
		this.forgetLastLookbehind()
	}

	isCurrEnd(): boolean {
		if (super.isCurrEnd()) return true
		this.lookahead = this.prodForth()
		return positionEqual(this.resource!, this.until)
	}

	isCurrStart(): boolean {
		if (super.isCurrStart()) return true
		this.lookbehind = this.prodBack()
		return positionEqual(this.resource!, this.from)
	}

	next() {
		this.isStart = false
		if (this.isCurrEnd()) this.endStream()
		else this.baseNextIter(this.curr)
	}

	prev() {
		this.isEnd = false
		if (this.isCurrStart()) this.startStream()
		else this.basePrevIter(this.curr)
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
	/**
	 * The predicate that has to be used as the argument for the `from`
	 * argument of `LimitedStream` in order to preserve the current
	 * position upon call to the `.init` initialization method.
	 *
	 * Note: If `to` is not passed, value for `from` is used for it instead,
	 * and this becomes the value for `from`
	 */
	export const NoMovementPredicate = T
}
