import type {
	BufferizedStreamClassInstance,
	PositionalStreamClassInstance,
	StreamClassInstance
} from "../interfaces.js"

import { positionIncrement } from "src/Position/utils.js"
import { deStart, end, getNext, readBuffer } from "../utils.js"
import { bufferPush } from "src/Collection/Buffer/utils.js"
import { bufferFreeze } from "src/Collection/Buffer/utils.js"

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
		positionIncrement(this)
		getNext(this)
	}
	return last
}

export function bufferNext<Type = any>(this: BufferizedStreamClassInstance<Type>) {
	const last = this.curr
	bufferPush(this, last)
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
			positionIncrement(this)
			readBuffer(this)
		}
	} else {
		bufferPush(this, last)

		if (this.isCurrEnd()) {
			bufferFreeze(this)
			end(this)
		} else {
			positionIncrement(this)
			getNext(this)
		}
	}

	return last
}

const methodList = [next, posNext, bufferNext, posBufferNext]

export function chooseMethod<Type = any>(pos: boolean = false, buffer: boolean = false) {
	return methodList[+pos | (+buffer << 1)]<Type>
}
