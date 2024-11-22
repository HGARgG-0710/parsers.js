import type { UnfreezableArray, UnfreezableString } from "./classes.js"
import type { UnfreezableBuffer } from "./interfaces.js"

export function freezableBufferFreeze<Type = any>(this: UnfreezableArray<Type>) {
	this.isFrozen = true
	return this
}

export function unfreezableBufferUnfreeze<Type = any>(this: UnfreezableBuffer<Type>) {
	this.isFrozen = false
	return this
}

export function freezableArrayPush<Type = any>(
	this: UnfreezableArray<Type>,
	...elements: Type[]
) {
	if (!this.isFrozen) this.value.push(...elements)
	return this
}

export function freezableArrayRead<Type = any>(this: UnfreezableArray<Type>, i: number) {
	return this.value[i]
}

export function unfreezableStringPush(this: UnfreezableString, ...strings: string[]) {
	if (!this.isFrozen) this.value += strings.join("")
	return this
}
