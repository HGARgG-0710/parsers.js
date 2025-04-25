import { WrapperStream } from "./WrapperStream.js"

export class PosStream<Type = any> extends WrapperStream<Type> {
	pos: number = 0

	forward() {
		return ++this.pos
	}
	
	backward() {
		return --this.pos
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
