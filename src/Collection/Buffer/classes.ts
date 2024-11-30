import type { FreezableBuffer, UnfreezableBuffer } from "./interfaces.js"

import { BasicPattern } from "../../Pattern/classes.js"
import { collectionIterator } from "../methods.js"
import {
	freezableBufferFreeze,
	freezableArrayPush,
	freezableArrayRead,
	unfreezableBufferUnfreeze,
	unfreezableStringPush
} from "./methods.js"

import { valueLength } from "../../Pattern/methods.js"
import { extendClass } from "../../utils.js"

import { defaults } from "../../constants.js"
const { isFrozen } = defaults.FreezableBuffer

export class UnfreezableArray<Type = any>
	extends BasicPattern<Type[]>
	implements UnfreezableBuffer<Type>
{
	value: Type[]
	isFrozen: boolean = isFrozen

	push: (...x: Type[]) => UnfreezableArray<Type>
	read: (i: number) => Type
	size: number

	freeze: () => UnfreezableArray<Type>
	unfreeze: () => UnfreezableArray<Type>;

	[Symbol.iterator]: () => Generator<Type>

	constructor(value: Type[] = []) {
		super(value)
	}
}

extendClass(UnfreezableArray, {
	unfreeze: { value: unfreezableBufferUnfreeze },
	freeze: { value: freezableBufferFreeze },
	push: { value: freezableArrayPush },
	read: { value: freezableArrayRead },
	size: { value: valueLength },
	[Symbol.iterator]: { value: collectionIterator }
})

export class UnfreezableString
	extends BasicPattern<string>
	implements UnfreezableBuffer<string>
{
	value: string
	isFrozen: boolean = isFrozen

	push: (...x: string[]) => UnfreezableString
	read: (i: number) => string
	size: number

	freeze: () => UnfreezableString
	unfreeze: () => UnfreezableString;

	[Symbol.iterator]: () => Generator<string>

	constructor(value: string = "") {
		super(value)
	}
}

extendClass(UnfreezableString, {
	unfreeze: { value: unfreezableBufferUnfreeze },
	freeze: { value: freezableBufferFreeze },
	push: { value: unfreezableStringPush },
	read: { value: freezableArrayRead<string> },
	size: { value: valueLength },
	[Symbol.iterator]: { value: collectionIterator }
})
