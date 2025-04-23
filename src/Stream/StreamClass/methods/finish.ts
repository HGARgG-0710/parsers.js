import { uniFinish } from "src/Stream/utils.js"
import type { IBufferized } from "../../../Collection/Buffer/interfaces.js"
import { lastIndex, readLast } from "../../../Collection/Buffer/refactor.js"
import { BitHash } from "../../../HashMap/classes.js"
import { ArrayInternal } from "../../../HashMap/InternalHash/classes.js"
import type { IStream } from "../../../Stream/interfaces.js"
import type { IPosed } from "../../Position/interfaces.js"
import { end, readBuffer, type IStreamClassInstanceImpl } from "../refactor.js"

// * possible 'finish' methods

function finish<Type = any>(this: IStream<Type>) {
	return uniFinish(this)
}

const posFinish = finish

function bufferFinish<Type = any>(
	this: IStreamClassInstanceImpl<Type> & IBufferized<Type>
) {
	const { buffer } = this
	if (buffer.isFrozen) {
		end(this)
		return (this.curr = readLast(buffer))
	}
	return uniFinish(this)
}

function posBufferFinish<Type = any>(
	this: IStreamClassInstanceImpl<Type> & IPosed<number> & IBufferized<Type>
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

export function chooseMethod(hasPosition = false, hasBuffer = false) {
	return MethodHash.index([hasPosition, hasBuffer])
}
