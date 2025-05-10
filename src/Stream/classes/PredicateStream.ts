import type { IOwnedStream, IPredicatePosition } from "../interfaces.js"
import { navigate } from "../utils.js"
import { DyssyncForwardStream, WrapperStream } from "./WrapperStream.js"

export function PredicateStream<Type = any>(
	predicate: IPredicatePosition<Type>
): new (resource?: IOwnedStream<Type>) => WrapperStream<Type> {
	return class extends DyssyncForwardStream<Type> {
		private hasLookahead: boolean = false
		private lookahead: Type

		private updateCurr() {
			this.curr = this.lookahead
		}

		private currGetter() {
			this.updateCurr()
			this.prod()
		}

		private prod() {
			this.lookahead = navigate(this.resource!, predicate)
			this.hasLookahead = this.resource!.isEnd
		}

		isCurrEnd(): boolean {
			return !this.hasLookahead
		}

		next() {
			const curr = super.next()
			if (this.isCurrEnd()) this.endStream()
			else this.currGetter()
			return curr
		}

		init(resource: IOwnedStream<Type>) {
			super.init(resource)
			this.prod()
			this.updateCurr()
			return this
		}
	}
}
