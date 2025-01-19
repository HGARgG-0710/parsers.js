import type {
	BufferizedReversedStreamClassInstance,
	PositionalReversedStreamClassInstance,
	ReversedStreamClassInstance
} from "../interfaces.js"

import { positionDecrement } from "../../../Position/utils.js"
import { deEnd } from "../refactor.js"
import { getPrev, readBuffer } from "../refactor.js"
import { start } from "../refactor.js"

// * possible '.prev' methods

export function prev<Type = any>(this: ReversedStreamClassInstance<Type>) {
	const last = this.curr
	deEnd(this)
	if (this.isCurrStart()) start(this)
	else getPrev(this)
	return last
}

export function posPrev<Type = any>(this: PositionalReversedStreamClassInstance<Type>) {
	const last = this.curr
	deEnd(this)
	if (this.isCurrStart()) start(this)
	else {
		positionDecrement(this)
		getPrev(this)
	}
	return last
}

export const bufferPrev = prev

export function posBufferPrev<Type = any>(
	this: BufferizedReversedStreamClassInstance<Type> &
		PositionalReversedStreamClassInstance<Type>
) {
	const last = this.curr
	deEnd(this)
	const isStart = this.pos === 0
	if (isStart) start(this)
	else {
		positionDecrement(this)
		readBuffer(this)
	}
	return last
}

const methodList = [prev, posPrev, bufferPrev, posBufferPrev]

export function chooseMethod<Type = any>(pos: boolean = false, buffer: boolean = false) {
	return methodList[+pos | (+buffer << 1)]<Type>
}
