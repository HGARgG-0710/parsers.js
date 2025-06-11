import type {
	ILinkedStream,
	IOwnedStream,
	IStreamPosition
} from "../../../interfaces/Stream.js"
import { navigate } from "../../../utils/Stream.js"
import { bind } from "../utils/StreamPosition.js"
import { DyssyncOwningStream } from "./DyssyncOwningStream.js"

interface IPredicateSettable<T = any> {
	setFilter(predicate: IStreamPosition<T>): this
}

type IFilterStreamConstructor<T = any> = new (
	resource?: IOwnedStream<T>
) => ILinkedStream<T> & IPredicateSettable<T>

function BuildFilterStream<T = any>() {
	return class extends DyssyncOwningStream.generic!<T, []>() {
		private hasLookahead: boolean = false
		private lookahead: T
		private filter: IStreamPosition<T>

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

		setResource(newResource: IOwnedStream): void {
			super.setResource(newResource)
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

		setFilter(filter: IStreamPosition<T>) {
			this.filter = bind(this, filter)
			return this
		}

		init(resource?: IOwnedStream<T>) {
			return super.init(resource)
		}
	}
}

let filterStream: IFilterStreamConstructor | null = null

function PreFilterStream<T = any>(): IFilterStreamConstructor<T> {
	return filterStream ? filterStream : (filterStream = BuildFilterStream<T>())
}

/**
 * This is a function for creation of `ILinkedStream<T>` factories.
 * These streams are characterized by filtering their input through
 * the `condition: IStreamPosition<T>`, and only allowing the items,
 * for which the filter returns true [when predicate]. When it's a
 * numeric filter, only every `n`th item is returned (where `n = condition`).
 */
export function FilterStream<T = any>(condition: IStreamPosition<T>) {
	const filterStream = PreFilterStream<T>()
	return function (resource?: IOwnedStream<T>) {
		return new filterStream()
			.setFilter(condition)
			.init(resource) as ILinkedStream<T>
	}
}
