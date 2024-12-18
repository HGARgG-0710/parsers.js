import type { Indexed } from "../../Stream/interfaces.js"
import type { HashClass, HashMap, HashType } from "./interfaces.js"
import type { Token as TypeToken } from "../../Token/interfaces.js"

import { extend } from "./methods.js"

import { type } from "../../Token/utils.js"
import { length } from "../../utils.js"

import { function as _f, typeof as _typeof } from "@hgargg-0710/one"
import { BaseHashClass } from "./abstract.js"
const { id } = _f
const { typeOf } = _typeof

export function HashClass<KeyType = any, ValueType = any, InternalKeyType = any>(
	hash: HashType<KeyType, ValueType, InternalKeyType>
): HashClass<KeyType, ValueType, InternalKeyType> {
	class hashClass
		extends BaseHashClass<KeyType, ValueType, InternalKeyType>
		implements HashMap<KeyType, ValueType, InternalKeyType>
	{
		static hash: HashType<KeyType, ValueType, InternalKeyType>
		static extend: (
			f: (x: any) => KeyType
		) => HashClass<KeyType, ValueType, InternalKeyType>
	}

	hashClass.prototype.hash = hash
	hashClass.hash = hash
	hashClass.extend = extend<KeyType, ValueType, InternalKeyType>

	return hashClass
}

export const [BasicHash, LengthHash, TokenHash, TypeofHash] = [
	id,
	length,
	type,
	typeOf
].map(HashClass) as [
	HashClass<any, any, any>,
	HashClass<Indexed, any, any>,
	HashClass<TypeToken, any, any>,
	HashClass<any, any, any>
]

export * as InternalHash from "./InternalHash/classes.js"
