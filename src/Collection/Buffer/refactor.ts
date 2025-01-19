import type { Bufferized, FreezableBuffer } from "./interfaces.js"

import { type } from "@hgargg-0710/one"
const { isUndefined } = type

export function assignBuffer<Type = any>(
	bufferized: Bufferized<Type>,
	buffer?: FreezableBuffer
) {
	if (!isUndefined(buffer)) bufferized.buffer = buffer
}

export const lastIndex = (buffer: FreezableBuffer) => buffer.size - 1

export function readLast<Type = any>(buffer: FreezableBuffer<Type>) {
	return buffer.read(lastIndex(buffer))
}

export function readFirst<Type = any>(buffer: FreezableBuffer<Type>) {
	return buffer.read(0)
}

export function bufferFreeze(bufferized: Bufferized) {
	bufferized.buffer.freeze()
}

export function bufferPush<Type = any>(bufferized: Bufferized<Type>, pushed: Type) {
	bufferized.buffer.push(pushed)
}
