import type { Summat } from "@hgargg-0710/summat.ts"
import type { Sizeable, StrictIndexable } from "../interfaces.js"
import type { InternalHash } from "./InternalHash/interfaces.js"

export interface Deletable<KeyType = any> extends Summat {
	delete: (key: KeyType) => any
}

export interface Settable<KeyType = any, ValueType = any> extends Summat {
	set: (key: KeyType, value: ValueType) => any
}

export interface KeyHaving<KeyType = any> extends Summat {
	keys: Set<KeyType>
}

export type HashType<KeyType = any, ValueType = any, InternalKeyType = any> = (
	x: KeyType,
	structure: InternalHash<InternalKeyType, ValueType>
) => InternalKeyType

export interface HashClass<KeyType = any, ValueType = any, InternalKeyType = any>
	extends Summat {
	new (structure: InternalHash<InternalKeyType, ValueType>): HashMap<
		KeyType,
		ValueType,
		InternalKeyType
	>
	hash: HashType<KeyType, ValueType, InternalKeyType>
	extend: (f: (x: any) => KeyType) => HashClass<any, ValueType, InternalKeyType>
}

export interface HashMap<KeyType = any, ValueType = any, InternalKeyType = any>
	extends StrictIndexable<KeyType, ValueType>,
		Settable<KeyType, ValueType>,
		Deletable<KeyType>,
		Sizeable,
		KeyHaving<KeyType> {
	hash: HashType<KeyType, ValueType, InternalKeyType>
	structure: InternalHash<InternalKeyType, ValueType>
}

export * as InternalHash from "./InternalHash/interfaces.js"
