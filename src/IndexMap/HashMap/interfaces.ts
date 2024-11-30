import type { Pointer } from "../../Pattern/interfaces.js"
import type { InternalHash } from "./InternalHash/interfaces.js"
import type { Indexable, Sizeable } from "../interfaces.js"

export interface Deletable<KeyType = any> {
	delete: (key: KeyType) => any
}

export interface Settable<KeyType = any, ValueType = any> {
	set: (key: KeyType, value: ValueType) => any
}

export interface KeyReplaceable<KeyType = any> {
	replaceKey: (keyFrom: KeyType, keyTo: KeyType) => any
}

export type HashType<KeyType = any, ValueType = any, InternalKeyType = any> = (
	x: KeyType,
	structure: InternalHash<InternalKeyType, ValueType>
) => InternalKeyType

export interface HashClass<KeyType = any, ValueType = any, InternalKeyType = any> {
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
		Sizeable {
	hash: HashType<KeyType, ValueType, InternalKeyType>
}

export interface ExactHashMap<KeyType = any, ValueType = any, InternalKeyType = any>
	extends HashMap<KeyType, ValueType, InternalKeyType>,
		Pointer<InternalHash<InternalKeyType, ValueType>> {}

export type * as InternalHash from "./InternalHash/interfaces.js"
