import type { Summat } from "@hgargg-0710/summat.ts"
import type { BasicReversibleStream } from "src/Stream/ReversibleStream/interfaces.js"
import type {
	BufferizedStreamClassInstance,
	PositionalStreamClassInstance
} from "../interfaces.js"

import { uniRewind } from "../utils.js"
import { start } from "../utils.js"
import { positionNull } from "src/Position/utils.js"
import { readFirst } from "src/Collection/Buffer/utils.js"

export interface Rewindable<Type = any> extends Summat {
	rewind: () => Type
}

// * possible '.rewind' methods

/**
 * A definition of `.rewind` that works for any `BasicReversibleStream`
 * 		(used as default, overriden in some classes for performance reasons)
 */

export function rewind<Type = any>(this: BasicReversibleStream<Type>) {
	return uniRewind(this)
}

export const posRewind = rewind

export function bufferRewind<Type = any>(this: BufferizedStreamClassInstance<Type>) {
	const { buffer } = this
	start(this)
	return buffer.size ? readFirst(buffer) : this.curr
}

export function posBufferRewind<Type = any>(
	this: BufferizedStreamClassInstance<Type> & PositionalStreamClassInstance<Type>
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
