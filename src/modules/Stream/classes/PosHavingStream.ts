import type { IPosed, IStream } from "../../../interfaces.js"
import { annotation } from "src/classes/Stream.js"

export abstract class PosHavingStream<T = any>
	extends annotation<T>
	implements IStream<T>, IPosed
{
	private _pos: number = 0

	private set pos(newPos: number) {
		this._pos = newPos
	}

	protected forward(n: number = 1) {
		return (this.pos += n)
	}

	protected backward(n: number = 1) {
		return (this.pos -= n)
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
