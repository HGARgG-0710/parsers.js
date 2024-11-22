import type { Summat } from "@hgargg-0710/summat.ts"
import type { Collection } from "../interfaces.js"

export interface FreezableBuffer<Type = any> extends Collection<Type> {
	size: number
	freeze: () => any
	read: (i: number) => Type
	readonly isFrozen: boolean
}

export interface UnfreezableBuffer<Type = any> extends FreezableBuffer<Type> {
	unfreeze: () => any
	isFrozen: boolean
}

export interface Bufferized<Type = any> extends Summat {
	buffer: FreezableBuffer<Type>
}
