import type { Indexed } from "../../Stream/interfaces.js"
import type { HashClass, HashMap, HashType } from "./interfaces.js"
import type { InternalHash } from "./InternalHash/interfaces.js"
import {
	hashClassExtend,
	hashMapDelete,
	hashMapIndex,
	hashMapReplaceKey,
	hashMapSet
} from "./methods.js"
import { valueSize } from "src/Pattern/methods.js"
import type { Token as TypeToken } from "../../Pattern/Token/interfaces.js"

import { function as _f, typeof as _typeof } from "@hgargg-0710/one"
import { type } from "src/Pattern/Token/utils.js"
import { length } from "src/utils.js"
import { BasicPattern } from "src/Pattern/classes.js"
const { id } = _f
const { typeOf } = _typeof

const HashClassPrototype = {
	index: { value: hashMapIndex },
	set: { value: hashMapSet },
	replaceKey: { value: hashMapReplaceKey },
	delete: { value: hashMapDelete },
	size: { get: valueSize }
}

export function HashClass<KeyType = any, ValueType = any, InternalKeyType = any>(
	hash: HashType<KeyType, ValueType, InternalKeyType>
): HashClass<KeyType, ValueType, InternalKeyType> {
	class hashClass
		extends BasicPattern<InternalHash<InternalKeyType, ValueType>>
		implements HashMap<KeyType, ValueType, InternalKeyType>
	{
		hash: HashType<KeyType, ValueType, InternalKeyType>
		size: number

		index: (x: KeyType) => ValueType
		set: (key: KeyType, value: ValueType) => any
		delete: (key: KeyType) => any
		replaceKey: (keyFrom: KeyType, keyTo: KeyType) => any

		static hash: HashType<KeyType, ValueType, InternalKeyType>
		static extend: (
			f: (x: any) => KeyType
		) => HashClass<KeyType, ValueType, InternalKeyType>

		constructor(structure: InternalHash<InternalKeyType, ValueType>) {
			super(structure)
		}
	}

	Object.defineProperties(hashClass.prototype, HashClassPrototype)
	hashClass.prototype.hash = hash

	hashClass.hash = hash
	hashClass.extend = hashClassExtend<KeyType, ValueType, InternalKeyType>

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
	HashMap<any, any, any>
]

export * as InternalHash from "./InternalHash/classes.js"
