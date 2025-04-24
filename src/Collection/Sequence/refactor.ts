import type { IBufferized, IFreezableSequence } from "./interfaces.js"

import { type } from "@hgargg-0710/one"
const { isNullary } = type

export function assignBuffer<Type = any>(
	bufferized: IBufferized<Type>,
	buffer?: IFreezableSequence
) {
	if (!isNullary(buffer)) bufferized.buffer = buffer
}

export const lastIndex = (buffer: IFreezableSequence) => buffer.size - 1

export function readLast<Type = any>(buffer: IFreezableSequence<Type>) {
	return buffer.read(lastIndex(buffer))
}

export function readFirst<Type = any>(buffer: IFreezableSequence<Type>) {
	return buffer.read(0)
}

export function bufferFreeze(bufferized: IBufferized) {
	bufferized.buffer.freeze()
}

export function bufferPush<Type = any>(bufferized: IBufferized<Type>, pushed: Type) {
	bufferized.buffer.push(pushed)
}
