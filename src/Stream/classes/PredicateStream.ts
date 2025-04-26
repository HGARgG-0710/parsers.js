import type { IOwnedStream, IPredicatePosition } from "../interfaces.js"
import { navigate } from "../utils.js"
import { WrapperStream } from "./WrapperStream.js"

export function PredicateStream<Type = any>(
	predicate: IPredicatePosition<Type>
): new (resource?: IOwnedStream<Type>) => WrapperStream<Type> {
	return class extends WrapperStream<Type> {
		private _isEnd: boolean
		private _curr: Type
		private hasLookahead: boolean = false
		private lookahead: Type

		private currGetter() {
			const curr = this.curr
			if (!this.isEnd) {
				this.curr = this.lookahead
				this.prod()
			}
			return curr
		}

		private prod() {
			this.lookahead = navigate(this.resource!, predicate)
			this.hasLookahead = this.resource!.isEnd
		}

		set curr(newCurr: Type) {
			this._curr = newCurr
		}

		get curr() {
			return this._curr
		}

		set isEnd(newIsEnd: boolean) {
			this._isEnd = newIsEnd
		}

		get isEnd() {
			return this._isEnd
		}

		isCurrEnd(): boolean {
			return !this.hasLookahead
		}

		next() {
			const curr = super.next()
			if (this.isCurrEnd()) this.isEnd = true
			else this.currGetter()
			return curr
		}

		init(resource: IOwnedStream<Type>) {
			super.init(resource)
			this.currGetter()
			return this
		}
	}
}
