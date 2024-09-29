import type { Indexed } from "src/Stream/interfaces.js"
import type { HashClass, HashMap, HashType } from "./interfaces.js"
import type { InternalHash } from "./InternalHash/interfaces.js"
import {
	hashClassExtend,
	hashMapDelete,
	hashMapIndex,
	hashMapSet,
	hashMapSize
} from "./methods.js"
import { Token } from "src/Pattern/Token/classes.js"
import type { Token as TypeToken } from "src/Pattern/Token/interfaces.js"

const HashClassPrototype = {
	index: { value: hashMapIndex },
	set: { value: hashMapSet },
	delete: { value: hashMapDelete },
	size: { get: hashMapSize }
}

export function HashClass<KeyType = any, ValueType = any, InternalKeyType = any>(
	hash: HashType<KeyType, ValueType, InternalKeyType>
): HashClass<KeyType, ValueType, InternalKeyType> {
	class hashClass implements HashMap<KeyType, ValueType, InternalKeyType> {
		hash: HashType<KeyType, ValueType, InternalKeyType>
		structure: InternalHash<InternalKeyType, ValueType>
		size: number
		keys: Set<KeyType>

		index: (x: KeyType) => ValueType
		set: (key: KeyType, value: ValueType) => any
		delete: (key: KeyType) => any

		static hash: HashType<KeyType, ValueType, InternalKeyType>
		static extend: (
			f: (x: any) => KeyType
		) => HashClass<KeyType, ValueType, InternalKeyType>

		constructor(structure: InternalHash<InternalKeyType, ValueType>) {
			this.structure = structure
			this.keys = new Set()
		}
	}

	Object.defineProperties(hashClass.prototype, HashClassPrototype)
	hashClass.prototype.hash = hash

	hashClass.hash = hash
	hashClass.extend = hashClassExtend<KeyType, ValueType, InternalKeyType>

	return hashClass
}

export const [BasicHash, LengthHash, TokenHash] = [
	(x: any) => x,
	(x: Indexed) => x.length,
	Token.type
].map(HashClass) as [
	HashClass<any, any, any>,
	HashClass<Indexed, any, any>,
	HashClass<TypeToken, any, any>
]

export * as InternalHash from "./InternalHash/classes.js"
