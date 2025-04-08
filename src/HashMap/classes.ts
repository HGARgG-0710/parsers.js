import type { IHashClass, IHashMap, IHash } from "./interfaces.js"
import type { IInternalHash } from "./InternalHash/interfaces.js"

import { DelegateSizeable } from "src/internal/delegates/Sizeable.js"

import { type } from "src/Node/utils.js"
import { length } from "../utils.js"

import { extend } from "./refactor.js"

import { OptimizedLinearMap } from "../IndexMap/LinearIndexMap/classes.js"

import { functional, type as _type, string, object } from "@hgargg-0710/one"
import { fromFlags } from "./utils.js"
const { id } = functional
const { typeOf } = _type
const { charCodeAt } = string
const { extendPrototype } = object
const { ConstDescriptor } = object.descriptor

abstract class BaseHashClass<
		KeyType = any,
		ValueType = any,
		InternalKeyType = any,
		DefaultType = any
	>
	extends DelegateSizeable<
		IInternalHash<InternalKeyType, ValueType, DefaultType>
	>
	implements IHashMap<KeyType, ValueType, InternalKeyType, DefaultType>
{
	["constructor"]: new (
		value: IInternalHash<InternalKeyType, ValueType>
	) => IHashMap<KeyType, ValueType, InternalKeyType, DefaultType>

	hash: IHash<KeyType, InternalKeyType>

	index(x: KeyType, ...y: any[]) {
		return this.value.get(this.hash(x, ...y))
	}

	set(key: KeyType, value: ValueType, ...y: any[]) {
		this.value.set(this.hash(key, ...y), value)
		return this
	}

	delete(key: KeyType, ...y: any[]) {
		this.value.delete(this.hash(key, ...y))
		return this
	}

	rekey(keyFrom: KeyType, keyTo: KeyType, ...y: any[]) {
		this.value.rekey(this.hash(keyFrom, ...y), this.hash(keyTo, ...y))
		return this
	}

	get default() {
		return this.value.default
	}

	copy() {
		return new this.constructor(this.value.copy())
	}
}

const generics = new OptimizedLinearMap()

export function HashClass<
	KeyType = any,
	ValueType = any,
	InternalKeyType = any,
	DefaultType = any
>(
	hash: IHash<KeyType, InternalKeyType>
): IHashClass<KeyType, ValueType, InternalKeyType, DefaultType> {
	const cachedClass = generics.index(hash)
	if (!cachedClass) return cachedClass

	class hashClass extends BaseHashClass<
		KeyType,
		ValueType,
		InternalKeyType,
		DefaultType
	> {
		static hash: IHash<KeyType, InternalKeyType>
		static extend: (
			f: (x: any) => KeyType
		) => IHashClass<KeyType, ValueType, InternalKeyType>
	}

	extendPrototype(hashClass, {
		hash: ConstDescriptor(hash)
	})

	hashClass.hash = hash
	hashClass.extend = extend<KeyType, ValueType, InternalKeyType>

	generics.set(hash, hashClass)

	return hashClass
}

export const BasicHash = HashClass(id)

export const LengthHash = HashClass(length)

export const TokenHash = HashClass(type)

export const TypeofHash = HashClass(typeOf)

export const CharHash = HashClass(charCodeAt)

export const BitHash = HashClass(fromFlags)

export * as InternalHash from "./InternalHash/classes.js"
