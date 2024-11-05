import type { Posed } from "src/Position/interfaces.js"
import type {
	BufferizedStreamClassInstance,
	PositionalStreamClassInstance,
	StreamClassInstance
} from "../interfaces.js"

// * utility functions

export function incPos(posed: Posed<number>) {
	++posed.pos
}

export function deStart(stream: StreamClassInstance) {
	stream.isStart = false
}

export function end(stream: StreamClassInstance) {
	stream.isEnd = true
}

export function bufferPushCurr<Type = any>(
	stream: BufferizedStreamClassInstance<Type>,
	pushed: Type
) {
	stream.buffer.push(pushed)
}

export function getNext(stream: StreamClassInstance) {
	stream.curr = stream.baseNextIter()
}

export function bufferFreeze(stream: BufferizedStreamClassInstance) {
	stream.buffer.freeze()
}

export function readBuffer<Type = any>(stream: BufferizedStreamClassInstance<Type>) {
	return (stream.curr = stream.buffer.read(stream.pos))
}

// * possible '.next' methods

export function next<Type = any>(this: StreamClassInstance<Type>) {
	const last = this.curr
	deStart(this)
	if (this.isCurrEnd()) end(this)
	else getNext(this)
	return last
}

export function posNext<Type = any>(this: PositionalStreamClassInstance<Type>) {
	const last = this.curr
	deStart(this)
	if (this.isCurrEnd()) end(this)
	else {
		incPos(this)
		getNext(this)
	}
	return last
}

export function bufferNext<Type = any>(this: BufferizedStreamClassInstance<Type>) {
	const last = this.curr
	bufferPushCurr(this, last)
	deStart(this)

	if (this.isCurrEnd()) {
		bufferFreeze(this)
		end(this)
	} else getNext(this)

	return last
}

export function posBufferNext<Type = any>(
	this: BufferizedStreamClassInstance<Type> & PositionalStreamClassInstance<Type>
) {
	const last = this.curr
	deStart(this)

	if (this.buffer.isFrozen) {
		if (this.pos !== this.buffer.size - 1) {
			incPos(this)
			readBuffer(this)
		}
	} else {
		bufferPushCurr(this, last)

		if (this.isCurrEnd()) {
			bufferFreeze(this)
			end(this)
		} else {
			incPos(this)
			getNext(this)
		}
	}

	return last
}

const methodList = [next, posNext, bufferNext, posBufferNext]

export function chooseMethod<Type = any>(pos: boolean = false, buffer: boolean = false) {
	return methodList[+pos | (+buffer << 1)]<Type>
}
