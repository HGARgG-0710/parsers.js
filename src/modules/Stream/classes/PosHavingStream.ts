import { annotation } from "src/classes/Stream.js"
import type { IPositionStream } from "../../../interfaces.js"

/**
 * This is an abstract class that implements `IPositionStream<T>`.
 * It contains no concrete properties, save for those that pertain to
 * `.pos` manipulation.
 */
export abstract class PosHavingStream<T = any>
	extends annotation<T>
	implements IPositionStream<T>
{
	private _pos: number = 0

	private set pos(newPos: number) {
		this._pos = newPos
	}

	protected forward(n: number = 1) {
		this.pos += n
	}

	protected backward(n: number = 1) {
		this.pos -= n
	}

	get pos() {
		return this._pos
	}

	isCurrStart() {
		return this.pos === 0
	}

	next() {
		this.forward()
	}

	prev() {
		this.backward()
	}
}
