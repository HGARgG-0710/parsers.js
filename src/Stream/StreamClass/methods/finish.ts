import type { IStream } from "../../../Stream/interfaces.js"
import type { IBufferized } from "../../../Collection/Buffer/interfaces.js"
import type { IPosed } from "../../Position/interfaces.js"
import type { IStreamClassInstance } from "../interfaces.js"

import { readLast } from "../../../Collection/Buffer/refactor.js"
import { lastIndex } from "../../../Collection/Buffer/refactor.js"
import { end, readBuffer } from "../refactor.js"

import { uniFinish } from "src/Stream/utils.js"
import { BitHash } from "../../../HashMap/classes.js"
import { ArrayInternal } from "../../../HashMap/InternalHash/classes.js"

// * possible 'finish' methods

function finish<Type = any>(this: IStream<Type>) {
	return uniFinish(this)
}

const posFinish = finish

function bufferFinish<Type = any>(
	this: IStreamClassInstance<Type> & IBufferized<Type>
) {
	const { buffer } = this
	if (buffer.isFrozen) {
		end(this)
		return (this.curr = readLast(buffer))
	}
	return uniFinish(this)
}

function posBufferFinish<Type = any>(
	this: IStreamClassInstance<Type> & IPosed<number> & IBufferized<Type>
) {
	const { buffer } = this
	if (buffer.isFrozen) {
		this.pos = lastIndex(buffer)
		end(this)
		return readBuffer(this)
	}
	return uniFinish(this)
}

const MethodHash = new BitHash(
	new ArrayInternal([finish, posFinish, bufferFinish, posBufferFinish])
)

export function chooseMethod(
	hasPosition: boolean = false,
	hasBuffer: boolean = false
) {
	return MethodHash.index([hasPosition, hasBuffer])
}
