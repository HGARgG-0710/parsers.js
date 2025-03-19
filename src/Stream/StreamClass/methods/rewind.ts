import type { IReversibleStream } from "../../../Stream/ReversibleStream/interfaces.js"
import type { IBufferized } from "../../../Collection/Buffer/interfaces.js"
import type { IPosed } from "../../../Position/interfaces.js"
import type { IStreamClassInstance } from "../interfaces.js"

import { uniRewind } from "../utils.js"
import { start } from "../refactor.js"
import { positionNull } from "src/Position/refactor.js"
import { readFirst } from "src/Collection/Buffer/refactor.js"

// * possible '.rewind' methods

/**
 * A definition of `.rewind` that works for any `BasicReversibleStream`
 * 		(used as default, overriden in some classes for performance reasons)
 */

function rewind<Type = any>(this: IReversibleStream<Type>) {
	return uniRewind(this)
}

const posRewind = rewind

function bufferRewind<Type = any>(this: IStreamClassInstance<Type> & IBufferized<Type>) {
	const { buffer } = this
	start(this)
	return buffer.size ? readFirst(buffer) : this.curr
}

function posBufferRewind<Type = any>(
	this: IStreamClassInstance<Type> & IBufferized<Type> & IPosed<number>
) {
	const { buffer } = this
	start(this)
	positionNull(this)
	return buffer.size ? readFirst(buffer) : this.curr
}

const methodList = [rewind, posRewind, bufferRewind, posBufferRewind]

export function chooseMethod<Type = any>(pos: boolean = false, buffer: boolean = false) {
	return methodList[+pos | (+buffer << 1)]<Type>
}
