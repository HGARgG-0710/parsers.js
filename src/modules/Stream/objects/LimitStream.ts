import { boolean, type } from "@hgargg-0710/one"
import * as Pools from "../../../global/Pools.js"
import { ownerInitializer } from "../../../objects/Initializer.js"
import { ObjectPool } from "../../../objects/ObjectPool.js"
import type { IPoolKeeping, IPredicatePosition } from "../../../interfaces.js"
import type {
	ICommonStream,
	ILinkedStream,
	IOwnedStream,
	IStream
} from "../../../interfaces/Stream.js"
import { mixin } from "../../../mixin.js"
import { navigate } from "../../../utils/Stream.js"
import type { ILimitableStream } from "../interfaces/LimitStream.js"
import type { IStreamPosition } from "../interfaces/StreamPosition.js"
import { bind, equals, negate } from "../utils/StreamPosition.js"
import { BasicResourceStream } from "./BasicResourceStream.js"
import { PoolableStream } from "./PoolableStream.js"

const { isNullary } = type
const { T } = boolean

interface IStateSettupable {
	setupState(): void
}

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

function BuildLimitStream<T = any>(
	from: IStreamPosition<T>,
	until: IStreamPosition<T>
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
				prodForth() {
					if (!this.lookahead.has())
						this.lookahead.set(this.prodForthWithoutLookahead())
				},

				prodForthWithoutLookahead() {
					super.next()
					return this.curr
				},

				baseNextIter(curr: T) {
					this.lookahead.reset()
					return this.resource.curr
				},

				goStartPos() {
					navigate(this.resource!, this.from)
				},

				get pool() {
					return this.class.pool
				},

				get initializer() {
					return limitStreamInitializer
				},

				set resource(resource: ILimitableStream<T>) {
					super.resource = resource
				},

				get resource() {
					return super.resource as ILimitableStream<T>
				},

				setResource(resource: ILimitableStream<T>) {
					super.setResource(resource)
					this.goStartPos()
					this.syncCurr()
				},

				setupState() {
					this.lookahead.reset()
				},

				isCurrEnd(): boolean {
					if (this.resource.isCurrEnd()) return true
					this.prodForth()
					return equals(this.resource!, this.until)
				},

				next() {
					if (this.isCurrEnd()) this.endStream()
					else this.baseNextIter(this.curr)
				},

				init(resource?: ILimitableStream<T>) {
					return super.init(resource)
				}
			},
			constructor(resource?: ILimitableStream<T>) {
				this.super.BasicResourceStream.constructor.call(this)
				this.lookahead = new Lookaround()
				this.until = bind(this, until)
				this.from = bind(this, from)
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
export function LimitStream<T = any>(
	from: IStreamPosition<T>,
	longAs?: IStreamPosition<T>
) {
	;[from, longAs] = LimitStream.ensurePredicatePair(from, longAs)

	const until = negate(longAs)
	const limitStream = BuildLimitStream<T>(from, until)

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

	/**
	 * This is a function for ensuring that the provided pair of
	 * predicates for definition of a `LimitStream` are interpreted
	 * as desired - the first argument `from` is optional, so if
	 * `longAs` is not provided, it is defined as `from`, with
	 * `from` itself being replaced with `LimitStream.NoMovementPredicate`.
	 */
	export function ensurePredicatePair<
		T = any,
		A extends IStreamPosition<T> = IStreamPosition<T>,
		B extends IStreamPosition<T> = IStreamPosition<T>
	>(from: A, longAs?: B) {
		return isNullary(longAs)
			? ([NoMovementPredicate, from] as [
					IPredicatePosition<IStream<T>>,
					A
			  ])
			: ([from, longAs] as [A, B])
	}
}
