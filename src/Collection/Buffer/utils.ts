import type { FreezableBuffer, Bufferized } from "./interfaces.js"
import { isCollection } from "../utils.js"

import { object, boolean, typeof as type, function as _f } from "@hgargg-0710/one"
const { structCheck } = object
const { T } = boolean
const { isBoolean, isFunction, isUndefined } = type
const { and } = _f

export const isFreezableBuffer = and(
	structCheck({
		value: T,
		isFrozen: isBoolean,
		freeze: isFunction,
		read: isFunction
	}),
	isCollection
) as <Type = any>(x: any) => x is FreezableBuffer<Type>

export const isBufferized = structCheck<Bufferized>({ buffer: isFreezableBuffer })

export function assignBuffer<Type = any>(
	bufferized: Bufferized<Type>,
	buffer?: FreezableBuffer
) {
	if (!isUndefined(buffer)) bufferized.buffer = buffer
}

export function lastIndex(buffer: FreezableBuffer) {
	return buffer.size - 1
}

export function readLast<Type = any>(buffer: FreezableBuffer<Type>) {
	return buffer.read(lastIndex(buffer))
}

export function readFirst<Type = any>(buffer: FreezableBuffer<Type>) {
	return buffer.read(0)
}

export function bufferFreeze(stream: Bufferized) {
	stream.buffer.freeze()
}

export function bufferPush<Type = any>(stream: Bufferized<Type>, pushed: Type) {
	stream.buffer.push(pushed)
}
