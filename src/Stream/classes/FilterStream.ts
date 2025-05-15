import type {
	ILinkedStream,
	IOwnedStream,
	IPredicatePosition
} from "../../interfaces/Stream.js"
import { maybeInit } from "../../utils.js"
import { navigate } from "../../utils/Stream.js"
import { positionBind } from "../utils/Position.js"
import { DyssyncForwardStream } from "./WrapperStream.js"

class _FilterStream<Type = any> extends DyssyncForwardStream<Type> {
	private hasLookahead: boolean = false
	private lookahead: Type
	private predicate: IPredicatePosition<Type>

	private updateCurr() {
		this.curr = this.lookahead
	}

	private currGetter() {
		this.updateCurr()
		this.prod()
	}

	private prod() {
		this.lookahead = navigate(this.resource!, this.predicate)
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

	setPredicate(predicate: IPredicatePosition<Type>) {
		this.predicate = positionBind(this, predicate)
		return this
	}

	init(resource: IOwnedStream<Type>) {
		super.init(resource)
		this.prod()
		this.updateCurr()
		return this
	}
}

export function FilterStream<Type = any>(predicate: IPredicatePosition<Type>) {
	return function (resource?: IOwnedStream<Type>): ILinkedStream<Type> {
		return maybeInit(new _FilterStream().setPredicate(predicate), resource)
	}
}
