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

export type HashType<KeyType = any, InternalKeyType = any> = (
	x: KeyType,
	...y: any[]
) => InternalKeyType

export interface HashClass<KeyType = any, ValueType = any, InternalKeyType = any> {
	new (structure: InternalHash<InternalKeyType, ValueType>): HashMap<
		KeyType,
		ValueType,
		InternalKeyType
	>
	hash: HashType<KeyType, InternalKeyType>
	extend: (f: (x: any) => KeyType) => HashClass<any, ValueType, InternalKeyType>
}

export interface HashMap<KeyType = any, ValueType = any, InternalKeyType = any>
	extends Indexable<ValueType>,
		Settable<KeyType, ValueType>,
		Deletable<KeyType>,
		KeyReplaceable<KeyType>,
		Sizeable {
	hash: HashType<KeyType, InternalKeyType>
}

export type * as InternalHash from "./InternalHash/interfaces.js"
