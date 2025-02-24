import type { Indexed } from "../../Stream/interfaces.js"
import type { HashClass, HashMap, Hash } from "./interfaces.js"
import type { Token as TypeToken } from "../../Token/interfaces.js"
import type { InternalHash } from "./InternalHash/interfaces.js"

import { DelegateSizeable } from "../abstract.js"

import { extend } from "./refactor.js"
import { type } from "../../Token/utils.js"
import { length } from "../../utils.js"

import { functional, type as _type, string } from "@hgargg-0710/one"
const { id } = functional
const { typeOf } = _type
const { charCodeAt } = string

abstract class BaseHashClass<
	KeyType = any,
	ValueType = any,
	InternalKeyType = any,
	DefaultType = any
> extends DelegateSizeable<InternalHash<InternalKeyType, ValueType, DefaultType>> {
	hash: Hash<KeyType, InternalKeyType>

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

	replaceKey(keyFrom: KeyType, keyTo: KeyType, ...y: any[]) {
		this.value.replaceKey(this.hash(keyFrom, ...y), this.hash(keyTo, ...y))
		return this
	}
}

export function HashClass<KeyType = any, ValueType = any, InternalKeyType = any>(
	hash: Hash<KeyType, InternalKeyType>
): HashClass<KeyType, ValueType, InternalKeyType> {
	class hashClass
		extends BaseHashClass<KeyType, ValueType, InternalKeyType>
		implements HashMap<KeyType, ValueType, InternalKeyType>
	{
		static hash: Hash<KeyType, InternalKeyType>
		static extend: (
			f: (x: any) => KeyType
		) => HashClass<KeyType, ValueType, InternalKeyType>
	}

	hashClass.prototype.hash = hash
	hashClass.hash = hash
	hashClass.extend = extend<KeyType, ValueType, InternalKeyType>

	return hashClass
}

export const [BasicHash, LengthHash, TokenHash, TypeofHash, CharHash] = [
	id,
	length,
	type,
	typeOf,
	charCodeAt
].map(HashClass) as [
	HashClass<any, any, any>,
	HashClass<Indexed, any, any>,
	HashClass<TypeToken, any, any>,
	HashClass<any, any, any>,
	HashClass<string, any, number>
]

export * as InternalHash from "./InternalHash/classes.js"
