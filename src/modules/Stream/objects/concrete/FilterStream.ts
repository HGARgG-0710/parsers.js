import { Pools } from "../../../../../main.js"
import type { IPoolKeeping } from "../../../../interfaces.js"
import type {
	IOwnedStream,
	IStreamStep
} from "../../../../interfaces/Stream.js"
import { ObjectPool } from "../../../../objects.js"
import { navigate } from "../../../../utils/Stream.js"
import type { ICommonStream } from "../../interfaces/CommonStream.js"
import { bindStep } from "../../utils/Step.js"
import { DyssyncOwningPoolableStream } from "../templates.js"

function BuildFilterStream<T = any>(
	filter: IStreamStep<T>
): IPoolKeeping<ICommonStream<T>, [IOwnedStream<T>]> {
	return class FilterStream extends DyssyncOwningPoolableStream<T> {
		static readonly pool = Pools.Stream.add(new ObjectPool(FilterStream))

		private readonly filter: IStreamStep<T>
		private lookahead: T
		private hasLookahead: boolean = false

		private currGetter() {
			this.updateCurr()
			this.prod()
		}

		private updateCurr() {
			this.curr = this.lookahead
		}

		private prod() {
			this.lookahead = navigate(this.resource!, this.filter)
			this.hasLookahead = this.resource!.isEnd
		}

		protected get pool() {
			return FilterStream.pool
		}

		baseInit(): void {
			this.prod()
			this.updateCurr()
		}

		isCurrEnd(): boolean {
			return !this.hasLookahead
		}

		next() {
			super.next()
			if (this.isCurrEnd()) this.endStream()
			else this.currGetter()
		}

		constructor(resource?: IOwnedStream<T>) {
			super()
			this.filter = bindStep(filter, this)
			this.init(resource)
		}
	}
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
