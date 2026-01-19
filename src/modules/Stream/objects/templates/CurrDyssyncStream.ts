import type { IStream } from "../../../../interfaces.js"

export abstract class CurrDyssyncStream<T = any> implements IStream<T> {
	abstract isCurrEnd(): boolean
	abstract next(): void
	abstract readonly isEnd: boolean

	private _curr: T | null

	protected resetCurr() {
		this._curr = null
	}

	protected set curr(newCurr: T) {
		this._curr = newCurr
	}

	get curr() {
		return this._curr!
	}
}
