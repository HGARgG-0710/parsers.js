import { Pools } from "../../../../main.js"
import type { IPoolKeeping } from "../../../interfaces.js"
import type {
	ILinkedStream,
	IOwnedStream,
	IStreamStep
} from "../../../interfaces/Stream.js"
import { mixin } from "../../../mixin.js"
import { ObjectPool } from "../../../objects.js"
import { navigate } from "../../../utils/Stream.js"
import type { ICommonStream } from "../interfaces/CommonStream.js"
import { DyssyncOwningStream } from "./DyssyncOwningStream.js"
import { PoolableStream } from "./PoolableStream.js"

function BuildFilterStream<T = any>(filter: IStreamStep<T>) {
	return new mixin(
		{
			name: "FilterStream",
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
				currGetter() {
					this.updateCurr()
					this.prod()
				},

				updateCurr() {
					this.curr = this.lookahead
				},

				prod() {
					this.lookahead = navigate(this.resource!, this.filter)
					this.hasLookahead = this.resource!.isEnd
				},

				setResource(resource: IOwnedStream): void {
					this.super.DyssyncOwningStream.setResource.call(
						this,
						resource
					)
					this.prod()
					this.updateCurr()
				},

				isCurrEnd(): boolean {
					return !this.hasLookahead
				},

				next() {
					this.super.DyssyncOwningStream.next.call(this)
					if (this.isCurrEnd()) this.endStream()
					else this.currGetter()
				},

				init(resource?: IOwnedStream<T>) {
					return this.super.DyssyncOwningStream.init.call(
						this,
						resource
					)
				},

				get pool() {
					return this.constructor.pool
				}
			},
			constructor(resource?: IOwnedStream<T>) {
				this.super.DyssyncOwningStream.constructor.call(this, resource)
				this.filter = filter
			}
		},
		[DyssyncOwningStream, PoolableStream]
	).toClass() as unknown as IPoolKeeping<ICommonStream<T>, [IOwnedStream<T>]>
}

/**
 * This is a function for creation of `IFilterStream<T>` factories.
 * These streams are characterized by filtering their input through
 * the `filter: IStreamPosition<T>`, and only allowing the items,
 * for which the filter returns true [when predicate]. When it's a
 * numeric filter, only every `n`th item is returned (where `n = condition`).
 */
export function FilterStream<T = any>(filter: IStreamStep<T>) {
	const filterStream = BuildFilterStream(filter)

	function F(resource?: IOwnedStream<T>): ICommonStream<T> {
		return filterStream.pool.create(resource)
	}

	F.pool = filterStream.pool

	return F
}
