import type {
	ILinkedStream,
	IOwnedStream,
	IPredicatePosition
} from "../../../interfaces/Stream.js"
import { navigate } from "../../../utils/Stream.js"
import { positionBind } from "../utils/Position.js"
import { DyssyncOwningStream } from "./DyssyncOwningStream.js"

interface IPredicateSettable<T = any> {
	setPredicate(predicate: IPredicatePosition<T>): this
}

type IFilterStreamConstructor<T = any> = new (
	resource?: IOwnedStream<T>
) => ILinkedStream<T> & IPredicateSettable<T>

function BuildFilterStream<T = any>() {
	return class extends DyssyncOwningStream.generic!<T, []>() {
		private hasLookahead: boolean = false
		private lookahead: T
		private predicate: IPredicatePosition<T>

		private currGetter() {
			this.updateCurr()
			this.prod()
		}

		private updateCurr() {
			this.curr = this.lookahead
		}

		private prod() {
			this.lookahead = navigate(this.resource!, this.predicate)
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

		setPredicate(predicate: IPredicatePosition<T>) {
			this.predicate = positionBind(this, predicate)
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

export function FilterStream<T = any>(predicate: IPredicatePosition<T>) {
	const filterStream = PreFilterStream<T>()
	return function (resource?: IOwnedStream<T>) {
		return new filterStream()
			.setPredicate(predicate)
			.init(resource) as ILinkedStream<T>
	}
}
