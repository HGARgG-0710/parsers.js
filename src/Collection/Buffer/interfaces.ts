import type { Collection } from "../interfaces.js"

export interface FreezableBuffer<Type = any> extends Collection<Type> {
	size: number
	freeze: () => void
	read: (i: number) => Type
	readonly isFrozen: boolean
}

export interface UnfreezableBuffer<Type = any> extends FreezableBuffer<Type> {
	unfreeze: () => void
	isFrozen: boolean
}
