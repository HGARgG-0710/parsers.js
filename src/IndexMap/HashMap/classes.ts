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
import { subSize } from "../SubHaving/methods.js"
import { Token } from "../../Pattern/Token/classes.js"
import type { Token as TypeToken } from "../../Pattern/Token/interfaces.js"

import { function as _f, typeof as type } from "@hgargg-0710/one"
import { BasicSubHaving } from "../SubHaving/classes.js"
const { id } = _f
const { typeOf } = type

const HashClassPrototype = {
	index: { value: hashMapIndex },
	set: { value: hashMapSet },
	replaceKey: { value: hashMapReplaceKey },
	delete: { value: hashMapDelete },
	size: { get: subSize }
}

export function HashClass<KeyType = any, ValueType = any, InternalKeyType = any>(
	hash: HashType<KeyType, ValueType, InternalKeyType>
): HashClass<KeyType, ValueType, InternalKeyType> {
	class hashClass
		extends BasicSubHaving<InternalHash<InternalKeyType, ValueType>>
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
	(x: Indexed) => x.length,
	Token.type,
	typeOf
].map(HashClass) as [
	HashClass<any, any, any>,
	HashClass<Indexed, any, any>,
	HashClass<TypeToken, any, any>,
	HashMap<any, any, any>
]

export * as InternalHash from "./InternalHash/classes.js"
