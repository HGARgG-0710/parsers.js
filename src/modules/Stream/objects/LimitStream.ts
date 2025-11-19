import { boolean, type } from "@hgargg-0710/one"
import assert from "assert"
import { asSteps, isStepPredicate } from "src/utils/Step.js"
import * as Pools from "../../../global/Pools.js"
import type { IPoolKeeping } from "../../../interfaces.js"
import type {
	ICommonStream,
	ILinkedStream,
	IOwnedStream
} from "../../../interfaces/Stream.js"
import { mixin } from "../../../mixin.js"
import { ObjectPool } from "../../../objects/ObjectPool.js"
import { navigate } from "../../../utils/Stream.js"
import type { ILimitableStream } from "../interfaces/LimitStream.js"
import type {
	IStreamPredicate,
	IStreamStep
} from "../interfaces/StreamPosition.js"
import { BasicResourceStream } from "./BasicResourceStream.js"
import { PoolableStream } from "./PoolableStream.js"

const { T, F } = boolean
const { isNullary } = type

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

	set(lookaround: T) {
		this.lookaround = lookaround
		this.hasLookaround = true
	}

	reset() {
		this.hasLookaround = false
	}

	get() {
		return this.lookaround!
	}
}

class ConfirmedStepsCounter {
	private stepsBeforeCheck: number = 0
	private _toCheckAgain: boolean = true

	private registerCheck() {
		this._toCheckAgain = false
	}

	private scheduleNewCheck() {
		this._toCheckAgain = true
	}

	private noMoreSteps() {
		return this.stepsBeforeCheck <= 0
	}

	get toCheckAgain() {
		return this._toCheckAgain
	}

	setSteps(steps: number) {
		this.stepsBeforeCheck = steps
		this.registerCheck()
	}

	isEnd() {
		return this.noMoreSteps() && !this._toCheckAgain
	}

	decSteps() {
		--this.stepsBeforeCheck
		if (this.noMoreSteps()) this.scheduleNewCheck()
	}
}

function BuildLimitStream<T = any>(
	from: IStreamStep<T>,
	longAs: IStreamStep<T>,
	isEmpty: IStreamPredicate<T>
) {
	return new mixin(
		{
			name: "LimitStream",
			static: {
				pool: (classObj) =>
					Pools.Stream.add(
						new ObjectPool(
							classObj as new (
								resource?: IOwnedStream<T>
							) => ILinkedStream<T>
						)
					)
			},
			properties: {
				baseNextIter(curr: T) {
					this.steps.decSteps()
					this.resource.next()
					return this.resource.curr
				},

				goStartPos() {
					navigate(this.resource!, this.from)
				},

				maybeEmpty() {
					this.isEnd = this.isEmpty(this.resource!)
					if (!this.isEnd) this.syncCurr()
				},

				get pool() {
					return this.class.pool
				},

				setResource(resource: ILimitableStream<T>) {
					this.super.BasicResourceStream.setResource.call(
						this,
						resource
					)
					this.goStartPos()
					this.maybeEmpty()
				},

				isCurrEnd(): boolean {
					if (this.isEnd || this.resource?.isCurrEnd()) return true
					if (this.steps.toCheckAgain) {
						this.steps.setSteps(
							asSteps(this.resource!, this.longAs)
						)
						return this.steps.isEnd()
					}
					return false
				},

				next() {
					if (this.isCurrEnd()) this.endStream()
					else this.baseNextIter(this.curr)
				}
			},
			constructor(resource?: ILimitableStream<T>) {
				this.super.BasicResourceStream.constructor.call(this)
				this.lookahead = new Lookaround()
				this.steps = new ConfirmedStepsCounter()
				this.isEmpty = isEmpty
				this.from = from
				this.longAs = longAs
				this.init(resource)
			}
		},
		[BasicResourceStream, PoolableStream]
	) as unknown as IPoolKeeping<ICommonStream<T>>
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
export function LimitStream<T = any>(limits: LimitStream.Limits<T>) {
	const { from, longAs, isEmpty } = limits
	const limitStream = BuildLimitStream<T>(from, longAs, isEmpty)

	function L(resource?: ILimitableStream<T>): ICommonStream<T> {
		return limitStream.pool.create(resource)
	}

	L.pool = limitStream.pool

	return L
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

	export class Limits<T = any> {
		static builder<T = any>() {
			return new LimitsBuilder<T>()
		}

		wrapLongAs(into: (wrapped: IStreamPredicate<T>) => IStreamStep<T>) {
			assert(isStepPredicate(this.longAs))
			return new Limits(this.from, into(this.longAs), this.isEmpty)
		}

		constructor(
			readonly from: IStreamStep<T>,
			readonly longAs: IStreamStep<T>,
			readonly isEmpty: IStreamPredicate<T>
		) {}
	}

	class LimitsBuilder<T = any> {
		private from: IStreamStep<T> = F
		private isEmpty: IStreamPredicate<T> = F
		private longAs?: IStreamStep<T>

		setFrom(from?: IStreamStep<T>) {
			if (!isNullary(from)) this.from = from
			return this
		}

		setIsEmpty(isEmpty?: IStreamPredicate<T>) {
			if (!isNullary(isEmpty)) this.isEmpty = isEmpty
			return this
		}

		setLongAs(longAs?: IStreamStep<T>) {
			if (!isNullary(longAs)) this.longAs = longAs
			return this
		}

		build() {
			assert(this.longAs)
			return new Limits(this.from, this.longAs, this.isEmpty)
		}
	}
}
