import type { FreezableArray } from "./classes.js"
import type { UnfreezableBuffer } from "./interfaces.js"

export function freezableArrayPush<Type = any>(
	this: FreezableArray<Type>,
	element: Type
) {
	if (!this.isFrozen) this.value.push(element)
}

export function freezableArrayFreeze<Type = any>(this: FreezableArray<Type>) {
	this.isFrozen = true
}

export function freezableArrayRead<Type = any>(this: FreezableArray<Type>, i: number) {
	return this.value[i]
}

export function unfreezableBufferUnfreeze<Type = any>(this: UnfreezableBuffer<Type>) {
	this.isFrozen = false
}
