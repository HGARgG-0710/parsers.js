import { ownerInitializer } from "../../classes/Initializer.js"
import type {
	ILinkedStream,
	IOwnedStream,
	IPredicatePosition
} from "../../interfaces/Stream.js"
import { navigate } from "../../utils/Stream.js"
import { positionBind } from "../utils/Position.js"
import { DyssyncForwardStream } from "./WrapperStream.js"

const filterStreamInitializer = {
	init(target: _FilterStream, resource: IOwnedStream) {
		ownerInitializer.init(target, resource)
		if (resource) target.setCurr()
	}
}

class _FilterStream<Type = any> extends DyssyncForwardStream<Type> {
	private hasLookahead: boolean = false
	private lookahead: Type
	private predicate: IPredicatePosition<Type>

	protected get initializer() {
		return filterStreamInitializer
	}

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

	setCurr() {
		this.prod()
		this.updateCurr()
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

	init(resource?: IOwnedStream<Type>) {
		return super.init(resource)
	}
}

export function FilterStream<Type = any>(predicate: IPredicatePosition<Type>) {
	return function (resource?: IOwnedStream<Type>): ILinkedStream<Type> {
		return new _FilterStream().setPredicate(predicate).init(resource)
	}
}
