import { boolean, type } from "@hgargg-0710/one"
import { ownerInitializer } from "../../../classes/Initializer.js"
import type { ILinkedStream } from "../../../interfaces/Stream.js"
import { isPredicatePosition } from "../../../utils/Position.js"
import { navigate } from "../../../utils/Stream.js"
import type { ILimitableStream } from "../interfaces/LimitStream.js"
import type { IStreamPosition } from "../interfaces/StreamPosition.js"
import { bind, direction, equals, negate } from "../utils/StreamPosition.js"
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

type IIterationDirectionChoice = ["next" | "prev", "next" | "prev"]

const limitStreamInitializer = {
	init(
		target: ILinkedStream & IStateSettupable,
		resource?: ILimitableStream
	) {
		target.setupState()
		ownerInitializer.init(target, resource)
	}
}

/**
 * A class encapsulating a lookaround of a `LimitStream`,
 * which may be present or absent.
 */
class Lookaround<T = any> {
	private hasLookaround = false
	private lookaround?: T

	has() {
		return this.hasLookaround
	}

	set(lookbehind: T) {
		this.lookaround = lookbehind
		this.hasLookaround = true
	}

	reset() {
		this.hasLookaround = false
	}

	get() {
		return this.lookaround!
	}
}

/**
 * A class encapsulating the process of picking iteration direction for a
 * `LimitStream` based off a given `direction: boolean`. 
 */
class DirectionPicker {
	private readonly backwards: IIterationDirectionChoice = ["next", "prev"]
	private readonly forwards: IIterationDirectionChoice = ["prev", "next"]

	private currentIteration: IIterationDirectionChoice

	forwardIteration() {
		return this.currentIteration[1]
	}

	backwardIteration() {
		return this.currentIteration[0]
	}

	from(direction: boolean) {
		this.currentIteration = direction ? this.forwards : this.backwards
	}
}

function BuildLimitStream<T = any>() {
	return class extends BasicResourceStream.generic!<T>() {
		private lookbehind = new Lookaround<T>()
		private lookahead = new Lookaround<T>()
		private directionPicker = new DirectionPicker()

		private from: IStreamPosition<T>
		private until: IStreamPosition<T>

		private startPos: IStreamPosition<T>

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
			if (!this.lookahead.has())
				this.lookahead.set(this.prodForthWithoutLookahead())
		}

		private prodForthWithoutLookahead() {
			super[this.directionPicker.forwardIteration()]()
			return this.curr
		}

		private prodBack() {
			if (!this.lookbehind.has())
				this.lookbehind.set(this.prodBackWithoutLookbehind())
		}

		private prodBackWithoutLookbehind() {
			super[this.directionPicker.backwardIteration()]()
			return this.curr
		}

		protected baseNextIter(curr: T) {
			this.lookbehind.set(curr)
			this.lookahead.reset()
			return this.resource.curr
		}

		protected basePrevIter(curr: T) {
			this.lookahead.set(curr)
			this.lookbehind.reset()
			return this.resource.curr
		}

		private findStartPos() {
			const initPos = this.resource.pos
			navigate(this.resource!, this.from)
			this.startPos = isPredicatePosition(this.from)
				? this.from
				: this.from + initPos
		}

		setResource(resource: ILimitableStream<T>) {
			super.setResource(resource)
			this.findStartPos()
			this.syncCurr()
		}

		setupState() {
			this.lookahead.reset()
			this.lookbehind.reset()
		}

		isCurrEnd(): boolean {
			if (this.resource.isCurrEnd()) return true
			this.prodForth()
			return equals(this.resource!, this.until)
		}

		isCurrStart(): boolean {
			if (this.resource.isCurrStart()) return true
			this.prodBack()
			return equals(this.resource!, this.startPos)
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
			this.directionPicker.from(direction)
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

/**
 * This is a function for creation of factories for instances
 * of `ILinkedStream<T>` interface. These instances accept a
 * `ILimitableStream<T>`, and return items that fall in between `from`
 * and `longAs`. They are `IStreamPosition<T>`s, with `from` defining
 * the "starting point" of the resulting `ILinkedStream<T>`
 * [more specifically, how-many-steps-before/until-what-condition-is-true],
 * and `longAs` defining the predicate/number-of-steps to use as an ending.
 *
 * By default, if `longAs` is not provided, it has the
 * value of `from`.
 *
 * Important note: if `from` is a negative number - the `.pos` of the
 * given `ILimitableStream<T>` must (itself) be greater than `from` in its absolute
 * value.
 */
export function LimitStream<T = any>(
	from: IStreamPosition<T>,
	longAs?: IStreamPosition<T>
) {
	if (isNullary(longAs)) {
		longAs = from
		from = LimitStream.NoMovementPredicate
	}

	const until = negate(longAs)
	const goDirection = direction(until)

	const limitStream = PreLimitStream<T>()

	return function (resource?: ILimitableStream<T>) {
		return new limitStream()
			.setDirection(goDirection)
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
