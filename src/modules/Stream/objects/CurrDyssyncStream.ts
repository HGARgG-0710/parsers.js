import type { IStream } from "../../../interfaces.js"

export abstract class CurrDyssyncStream<T = any> implements IStream<T> {
	abstract isCurrEnd(): boolean
	abstract next(): void
	abstract readonly isEnd: boolean

	private _curr: T

	protected set curr(newCurr) {
		this._curr = newCurr
	}

	get curr() {
		return this._curr
	}
}
