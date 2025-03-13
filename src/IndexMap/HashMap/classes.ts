import type { Indexed } from "src/interfaces.js"
import type { IHashClass, HashMap, Hash } from "./interfaces.js"
import type { IToken as TypeToken } from "../../Token/interfaces.js"
import type { IInternalHash } from "./InternalHash/interfaces.js"

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
> extends DelegateSizeable<IInternalHash<InternalKeyType, ValueType, DefaultType>> {
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

	rekey(keyFrom: KeyType, keyTo: KeyType, ...y: any[]) {
		this.value.rekey(this.hash(keyFrom, ...y), this.hash(keyTo, ...y))
		return this
	}
}

export function HashClass<KeyType = any, ValueType = any, InternalKeyType = any>(
	hash: Hash<KeyType, InternalKeyType>
): IHashClass<KeyType, ValueType, InternalKeyType> {
	class hashClass
		extends BaseHashClass<KeyType, ValueType, InternalKeyType>
		implements HashMap<KeyType, ValueType, InternalKeyType>
	{
		static hash: Hash<KeyType, InternalKeyType>
		static extend: (
			f: (x: any) => KeyType
		) => IHashClass<KeyType, ValueType, InternalKeyType>
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
	IHashClass<any, any, any>,
	IHashClass<Indexed, any, any>,
	IHashClass<TypeToken, any, any>,
	IHashClass<any, any, any>,
	IHashClass<string, any, number>
]

export * as InternalHash from "./InternalHash/classes.js"
