import type { Collection } from "../interfaces.js"
import type { FreezableBuffer, UnfreezableBuffer } from "./interfaces.js"

import { BasicPattern } from "../../classes.js"
import { collectionIterator } from "../methods.js"
import {
	freezableArrayFreeze,
	freezableArrayPush,
	freezableArrayRead,
	unfreezableBufferUnfreeze} from "./methods.js"
import { valueLengthDelegate } from "src/Pattern/methods.js"

export class FreezableArray<Type = any>
	extends BasicPattern<Type[]>
	implements FreezableBuffer<Type>
{
	isFrozen: boolean = false

	push: (...x: Type[]) => Collection<Type>
	freeze: () => void
	read: (i: number) => Type
	size: number;

	[Symbol.iterator]: () => Generator<Type>

	constructor(value: Type[]) {
		super(value)
	}
}

Object.defineProperties(FreezableArray.prototype, {
	push: { value: freezableArrayPush },
	freeze: { value: freezableArrayFreeze },
	read: { value: freezableArrayRead },
	size: { value: valueLengthDelegate },
	[Symbol.iterator]: { value: collectionIterator }
})

export class UnfreezableArray<Type = any>
	extends FreezableArray<Type>
	implements UnfreezableBuffer<Type>
{
	unfreeze: () => void
	constructor(value: Type[]) {
		super(value)
	}
}

Object.defineProperties(UnfreezableArray.prototype, {
	unfreeze: { value: unfreezableBufferUnfreeze }
})
