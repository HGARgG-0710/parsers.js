import type { BasicStream } from "src/Stream/interfaces.js"
import type {
	BufferizedReversedStreamClassInstance,
	PositionalReversedStreamClassInstance,
	ReversedStreamClassInstance,
	StartedType
} from "../interfaces.js"
import type { Posed } from "src/Position/interfaces.js"
import { readBuffer } from "./next.js"
import { StreamClass } from "src/constants.js"
import type { Started } from "src/Stream/ReversibleStream/interfaces.js"

// * utility functions

export function deEnd(stream: BasicStream) {
	stream.isEnd = false
}

export function start(stream: Started<StartedType>) {
	stream.isStart = StreamClass.PostCurrInit
}

export function getPrev(stream: ReversedStreamClassInstance) {
	stream.curr = stream.basePrevIter()
}

export function decPos(posed: Posed<number>) {
	--posed.pos
}

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
		decPos(this)
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
	if (isStart) this.isStart = true
	else {
		decPos(this)
		readBuffer(this)
	}
	return last
}

const methodList = [prev, posPrev, bufferPrev, posBufferPrev]

export function chooseMethod<Type = any>(pos: boolean = false, buffer: boolean = false) {
	return methodList[+pos | (+buffer << 1)]<Type>
}
