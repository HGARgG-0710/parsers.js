import type { FreezableBuffer } from "src/Pattern/Collection/Buffer/interfaces.js"
import type { BasicStream } from "src/Stream/interfaces.js"
import type {
	BufferizedStreamClassInstance,
	PositionalStreamClassInstance
} from "../interfaces.js"

import { uniFinish } from "../utils.js"
import { end, readBuffer } from "./next.js"

// * utility functions

export function readLast<Type = any>(buffer: FreezableBuffer<Type>) {
	return buffer.read(lastIndex(buffer))
}

export function lastIndex(buffer: FreezableBuffer) {
	return buffer.size - 1
}

// * possible 'finish' methods

export function finish<Type = any>(this: BasicStream<Type>) {
	return uniFinish(this)
}

export const posFinish = finish

export function bufferFinish<Type = any>(this: BufferizedStreamClassInstance<Type>) {
	const { buffer } = this
	if (buffer.isFrozen) {
		end(this)
		return (this.curr = readLast(buffer))
	}
	return uniFinish(this)
}

export function posBufferFinish<Type = any>(
	this: BufferizedStreamClassInstance<Type> & PositionalStreamClassInstance<Type>
) {
	const { buffer } = this
	if (buffer.isFrozen) {
		this.pos = lastIndex(buffer)
		end(this)
		return readBuffer(this)
	}
	return uniFinish(this)
}

const methodList = [finish, posFinish, bufferFinish, posBufferFinish]

export function chooseMethod<Type = any>(pos: boolean = false, buffer: boolean = false) {
	return methodList[+pos | (+buffer << 1)]<Type>
}
