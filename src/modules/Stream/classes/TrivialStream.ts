import { OwnableStream } from "./IterableStream.js"

export abstract class TrivialStream<Type = any> extends OwnableStream<Type> {
	private _curr: Type
	private _isEnd: boolean
	private _isStart: boolean

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

	protected set isStart(newIsStart: boolean) {
		this._isStart = newIsStart
	}

	get isStart() {
		return this._isStart
	}

	isCurrEnd(): boolean {
		return true
	}

	next(): Type {
		this.isStart = false
		this.isEnd = true
		return this.curr
	}
}
