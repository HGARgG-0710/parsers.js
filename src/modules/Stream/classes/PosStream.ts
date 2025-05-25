import { WrapperStream } from "./WrapperStream.js"

export class PosStream<Type = any> extends WrapperStream<Type> {
	private _pos: number = 0

	protected set pos(newPos: number) {
		this._pos = newPos
	}

	get pos() {
		return this._pos
	}

	isCurrStart() {
		return this.pos === 0
	}

	forward(n: number = 1) {
		return (this.pos += n)
	}

	backward(n: number = 1) {
		return (this.pos -= n)
	}

	next() {
		super.next()
		this.forward()
	}

	prev() {
		super.prev()
		this.backward()
	}
}
