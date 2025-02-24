import type { BasicReversibleStream } from "../../../Stream/ReversibleStream/interfaces.js"
import type { Bufferized } from "../../../Collection/Buffer/interfaces.js"
import type { StreamClassInstance } from "../interfaces.js"
import type { Posed } from "../../../Position/interfaces.js"

import { uniRewind } from "../utils.js"
import { start } from "../refactor.js"
import { positionNull } from "src/Position/refactor.js"
import { readFirst } from "src/Collection/Buffer/refactor.js"

export interface Rewindable<Type = any> {
	rewind: () => Type
}

// * possible '.rewind' methods

/**
 * A definition of `.rewind` that works for any `BasicReversibleStream`
 * 		(used as default, overriden in some classes for performance reasons)
 */

function rewind<Type = any>(this: BasicReversibleStream<Type>) {
	return uniRewind(this)
}

const posRewind = rewind

function bufferRewind<Type = any>(this: StreamClassInstance<Type> & Bufferized<Type>) {
	const { buffer } = this
	start(this)
	return buffer.size ? readFirst(buffer) : this.curr
}

function posBufferRewind<Type = any>(
	this: StreamClassInstance<Type> & Bufferized<Type> & Posed<number>
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
