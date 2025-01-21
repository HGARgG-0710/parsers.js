import type { BasicStream } from "../../../Stream/interfaces.js"
import type {
	BufferizedStreamClassInstance,
	PositionalStreamClassInstance
} from "../interfaces.js"

import { uniFinish } from "../utils.js"
import { readBuffer } from "../refactor.js"
import { end } from "../refactor.js"
import { readLast } from "src/Collection/Buffer/refactor.js"
import { lastIndex } from "src/Collection/Buffer/refactor.js"

export interface Finishable<Type = any> {
	finish: () => Type
}

// * possible 'finish' methods

function finish<Type = any>(this: BasicStream<Type>) {
	return uniFinish(this)
}

const posFinish = finish

function bufferFinish<Type = any>(this: BufferizedStreamClassInstance<Type>) {
	const { buffer } = this
	if (buffer.isFrozen) {
		end(this)
		return (this.curr = readLast(buffer))
	}
	return uniFinish(this)
}

function posBufferFinish<Type = any>(
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
