import type { IInitializer, IStream } from "../../../interfaces.js"
import { Initializable } from "../../../objects/Initializer.js"

const iteratorStreamInitializer: IInitializer<[Iterable<any>]> = {
	init(target: IteratorStream, iterable: Iterable<any>) {
		if (iterable) target.setIterable(iterable)
	}
}

/**
 * This is a wrapper around the `Iterable` interface, permitting
 * one to treat it as a (non-iterable) `IStream<T>`. 
 */
export class IteratorStream<T = any>
	extends Initializable<[Iterable<T>]>
	implements IStream<T>
{
	private iterator: Iterator<T>
	private _curr: T
	private lookahead: T
	private _isEnd: boolean
	private _isCurrEnd: boolean

	private processNext() {
		this._curr = this.lookahead
		this._isEnd = this._isCurrEnd
		this.processAhead()
	}

	private processAhead() {
		const { value, done } = this.iterator.next()
		this.lookahead = value
		this._isCurrEnd = !!done
	}

	setIterable(iterable: Iterable<T>) {
		this.iterator = iterable[Symbol.iterator]()
		this.processAhead()
		this.processNext()
	}

	isCurrEnd(): boolean {
		return this._isCurrEnd
	}

	get isEnd() {
		return this._isEnd
	}

	get curr() {
		return this._curr
	}

	next() {
		this.processNext()
	}

	protected get initializer() {
		return iteratorStreamInitializer
	}
}
