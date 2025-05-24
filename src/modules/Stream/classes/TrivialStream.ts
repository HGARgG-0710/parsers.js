import { OwnableStream } from "./IterableStream.js"

export abstract class TrivialStream<Type = any> extends OwnableStream<Type> {
	private _curr: Type
	private _isEnd: boolean

	protected set curr(newCurr: Type) {
		this._curr = newCurr
	}

	get curr() {
		return this._curr
	}

	protected set isEnd(newIsEnd: boolean) {
		this._isEnd = newIsEnd
	}

	get isEnd() {
		return this._isEnd
	}

	isCurrEnd(): boolean {
		return true
	}

	next(): Type {
		this.isEnd = true
		return this.curr
	}
}
