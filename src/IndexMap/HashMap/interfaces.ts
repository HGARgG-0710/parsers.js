import type { Summat } from "@hgargg-0710/summat.ts"
import type { Indexable, Sizeable } from "../interfaces.js"
import type { InternalHash } from "./InternalHash/interfaces.js"
import type { SubHaving } from "../SubHaving/interfaces.js"

export interface Deletable<KeyType = any> extends Summat {
	delete: (key: KeyType) => any
}

export interface Settable<KeyType = any, ValueType = any> extends Summat {
	set: (key: KeyType, value: ValueType) => any
}

export interface KeyReplaceable<KeyType = any> {
	replaceKey: (keyFrom: KeyType, keyTo: KeyType) => any
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
	extends Indexable<ValueType>,
		Settable<KeyType, ValueType>,
		Deletable<KeyType>,
		KeyReplaceable<KeyType>,
		Sizeable,
		SubHaving<InternalHash<InternalKeyType, ValueType>> {
	hash: HashType<KeyType, ValueType, InternalKeyType>
}

export type * as InternalHash from "./InternalHash/interfaces.js"
