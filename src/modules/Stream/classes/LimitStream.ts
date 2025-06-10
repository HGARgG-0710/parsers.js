import { boolean, type } from "@hgargg-0710/one"
import { ownerInitializer } from "../../../classes/Initializer.js"
import type { ILinkedStream } from "../../../interfaces/Stream.js"
import { navigate } from "../../../utils/Stream.js"
import type { ILimitableStream } from "../interfaces/LimitStream.js"
import type { IStreamPosition } from "../interfaces/StreamPosition.js"
import { bind, compare, equals, negate } from "../utils/StreamPosition.js"
import { BasicResourceStream } from "./BasicResourceStream.js"

const { isNullary } = type
const { T } = boolean

interface IStateSettupable {
	setupState(): void
}

interface ILimitSetterMethods<T = any> {
	setDirection(direction: boolean): this
	setFrom(from: IStreamPosition<T>): this
	setUntil(until: IStreamPosition<T>): this
}

type ILimitStreamConsructor<T = any> = new (
	resource?: ILimitableStream<T>
) => ILinkedStream<T> & IStateSettupable & ILimitSetterMethods<T>

const limitStreamInitializer = {
	init(
		target: ILinkedStream & IStateSettupable,
		resource?: ILimitableStream
	) {
		target.setupState()
		ownerInitializer.init(target, resource)
	}
}

function BuildLimitStream<T = any>() {
	return class extends BasicResourceStream.generic!<T>() {
		private hasLookahead = false
		private hasLookbehind = false

		private lookbehind: T
		private lookahead: T

		private direction: boolean
		private from: IStreamPosition<T>
		private until: IStreamPosition<T>

		protected get initializer() {
			return limitStreamInitializer
		}

		protected set resource(newResource: ILimitableStream<T>) {
			super.resource = newResource
		}

		get resource() {
			return super.resource as ILimitableStream<T>
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

		protected baseNextIter(curr: T) {
			this.lookbehind = curr
			this.hasLookbehind = true
			this.hasLookahead = false
			return this.resource.curr
		}

		protected basePrevIter(curr: T) {
			this.lookahead = curr
			this.hasLookahead = true
			this.hasLookbehind = false
			return this.resource.curr
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

		setResource(resource: ILimitableStream<T>) {
			super.setResource(resource)
			this.findStartPos()
			this.syncCurr()
		}

		setupState() {
			this.forgetLastLookahead()
			this.forgetLastLookbehind()
		}

		isCurrEnd(): boolean {
			if (this.resource.isCurrEnd()) return true
			this.lookahead = this.prodForth()
			return equals(this.resource!, this.until)
		}

		isCurrStart(): boolean {
			if (this.resource.isCurrStart()) return true
			this.lookbehind = this.prodBack()
			return equals(this.resource!, this.from)
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

		init(resource?: ILimitableStream<T>) {
			return super.init(resource)
		}

		setFrom(from: IStreamPosition<T>) {
			this.from = bind(this, from)
			return this
		}

		setUntil(until: IStreamPosition<T>) {
			this.until = bind(this, until)
			return this
		}

		setDirection(direction: boolean) {
			this.direction = direction
			return this
		}

		constructor(resource?: ILimitableStream<T>) {
			super(resource)
		}
	}
}

let limitStream: ILimitStreamConsructor | null = null

function PreLimitStream<T = any>(): ILimitStreamConsructor<T> {
	return limitStream ? limitStream : (limitStream = BuildLimitStream<T>())
}

export function LimitStream<T = any>(
	from: IStreamPosition<T>,
	longAs?: IStreamPosition<T>
) {
	if (isNullary(longAs)) {
		longAs = from
		from = LimitStream.NoMovementPredicate
	}

	const until = negate(longAs)
	const direction = compare(from, until)

	const limitStream = PreLimitStream<T>()

	return function (resource?: ILimitableStream<T>) {
		return new limitStream()
			.setDirection(direction)
			.setFrom(from)
			.setUntil(until)
			.init(resource) as ILinkedStream<T>
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
