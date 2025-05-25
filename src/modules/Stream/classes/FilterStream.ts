import type {
	ILinkedStream,
	IOwnedStream,
	IPredicatePosition
} from "../../../interfaces/Stream.js"
import { navigate } from "../../../utils/Stream.js"
import { positionBind } from "../utils/Position.js"
import { DyssyncForwardStream } from "./WrapperStream.js"

class _FilterStream<Type = any> extends DyssyncForwardStream<Type> {
	private hasLookahead: boolean = false
	private lookahead: Type
	private predicate: IPredicatePosition<Type>

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

	setPredicate(predicate: IPredicatePosition<Type>) {
		this.predicate = positionBind(this, predicate)
		return this
	}

	init(resource?: IOwnedStream<Type>) {
		return super.init(resource)
	}
}

export function FilterStream<Type = any>(predicate: IPredicatePosition<Type>) {
	return function (resource?: IOwnedStream<Type>): ILinkedStream<Type> {
		return new _FilterStream().setPredicate(predicate).init(resource)
	}
}
