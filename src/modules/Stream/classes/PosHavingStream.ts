import type { IPositionStream } from "../../../interfaces.js"

/**
 * This is an abstract class that implements `IPositionStream<T>`.
 * It contains no concrete properties, save for those that pertain to
 * `.pos` manipulation.
 */
export abstract class PosHavingStream<T = any> implements IPositionStream<T> {
	abstract isCurrEnd: () => boolean
	abstract readonly isEnd: boolean
	abstract readonly curr: T

	private _pos: number = 0

	private set pos(newPos: number) {
		this._pos = newPos
	}

	protected forward(n: number = 1) {
		this.pos += n
	}

	get pos() {
		return this._pos
	}

	next() {
		this.forward()
	}
}
