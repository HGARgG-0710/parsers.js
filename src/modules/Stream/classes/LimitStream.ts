import { boolean, type } from "@hgargg-0710/one"
import { ownerInitializer } from "../../../classes/Initializer.js"
import type { ILinkedStream } from "../../../interfaces/Stream.js"
import { navigate } from "../../../utils/Stream.js"
import type { ILimitableStream } from "../interfaces/LimitStream.js"
import type { IStreamPosition } from "../interfaces/StreamPosition.js"
import { bind, equals, negate } from "../utils/StreamPosition.js"
import { BasicResourceStream } from "./BasicResourceStream.js"

const { isNullary } = type
const { T } = boolean

interface IStateSettupable {
	setupState(): void
}

interface ILimitSetterMethods<T = any> {
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

function BuildLimitStream<T = any>() {
	return class extends BasicResourceStream.generic!<T>() {
		private lookbehind = new Lookaround<T>()
		private lookahead = new Lookaround<T>()

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
			if (!this.lookahead.has())
				this.lookahead.set(this.prodForthWithoutLookahead())
		}

		private prodForthWithoutLookahead() {
			super.next()
			return this.curr
		}

		protected baseNextIter(curr: T) {
			this.lookbehind.set(curr)
			this.lookahead.reset()
			return this.resource.curr
		}

		private goStartPos() {
			navigate(this.resource!, this.from)
		}

		setResource(resource: ILimitableStream<T>) {
			super.setResource(resource)
			this.goStartPos()
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

		next() {
			this.isStart = false
			if (this.isCurrEnd()) this.endStream()
			else this.baseNextIter(this.curr)
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
	const limitStream = PreLimitStream<T>()

	return function (resource?: ILimitableStream<T>) {
		return new limitStream()
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
