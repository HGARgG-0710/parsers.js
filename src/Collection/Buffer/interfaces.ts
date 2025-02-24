import type { Collection } from "../interfaces.js"

export interface FreezableBuffer<Type = any> extends Collection<Type> {
	size: number
	freeze: () => this
	read: (i: number) => Type
	readonly isFrozen: boolean
}

export interface UnfreezableBuffer<Type = any> extends FreezableBuffer<Type> {
	unfreeze: () => this
	isFrozen: boolean
}

export interface Bufferized<Type = any> {
	buffer: FreezableBuffer<Type>
}
