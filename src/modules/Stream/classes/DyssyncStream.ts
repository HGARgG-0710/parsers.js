import type { IInitializable, IStream } from "../../../interfaces.js"

export abstract class DyssyncStream<T = any, Args extends any[] = []>
	implements IStream<T>, IInitializable<Args>
{
	private _curr: T
	private _isEnd: boolean = false
	private _isStart: boolean = true

	protected endStream() {
		this.isEnd = true
		this.isStart = false
	}

	protected startStream() {
		this.isStart = true
		this.isEnd = false
	}

	protected set curr(newCurr) {
		this._curr = newCurr
	}

	protected set isEnd(newIsEnd: boolean) {
		this._isEnd = newIsEnd
	}

	protected set isStart(newIsStart: boolean) {
		this._isStart = newIsStart
	}

	get curr() {
		return this._curr
	}

	get isEnd() {
		return this._isEnd
	}

	get isStart() {
		return this._isStart
	}

	abstract isCurrEnd(): boolean

	abstract next(): void

	abstract init(...args: Partial<Args>): this

	abstract copy(): this

	abstract [Symbol.iterator](): Generator<T>
}
