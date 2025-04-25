import { WrapperStream } from "./WrapperStream.js"

export class PosStream<Type = any> extends WrapperStream<Type> {
	pos: number = 0

	forward(n: number = 1) {
		return this.pos += n
	}

	backward(n: number = 1) {
		return (this.pos -= n)
	}

	next() {
		const lastCurr = super.next()
		this.forward()
		return lastCurr
	}

	prev() {
		const lastCurr = super.prev()
		this.backward()
		return lastCurr
	}
}
