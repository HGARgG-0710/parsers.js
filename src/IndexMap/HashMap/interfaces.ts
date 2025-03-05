import type { InternalHash } from "./InternalHash/interfaces.js"
import type { Indexable, Sizeable } from "../interfaces.js"

export interface Deletable<KeyType = any> {
	delete: (key: KeyType) => this
}

export interface Settable<KeyType = any, ValueType = any> {
	set: (key: KeyType, value: ValueType) => this
}

export interface KeyReplaceable<KeyType = any> {
	replaceKey: (keyFrom: KeyType, keyTo: KeyType) => this
}

export type Hash<KeyType = any, InternalKeyType = any> = (
	x: KeyType,
	...y: any[]
) => InternalKeyType

export interface Hashable<KeyType, InternalKeyType> {
	hash: Hash<KeyType, InternalKeyType>
}

export interface IHashClass<KeyType = any, ValueType = any, InternalKeyType = any>
	extends Hashable<KeyType, InternalKeyType> {
	new (structure: InternalHash<InternalKeyType, ValueType>): HashMap<
		KeyType,
		ValueType,
		InternalKeyType
	>
	extend: (f: (x: any) => KeyType) => IHashClass<any, ValueType, InternalKeyType>
}

export interface HashMap<
	KeyType = any,
	ValueType = any,
	InternalKeyType = any,
	DefaultType = any
> extends Indexable<ValueType | DefaultType>,
		Settable<KeyType, ValueType | DefaultType>,
		Deletable<KeyType>,
		KeyReplaceable<KeyType>,
		Sizeable,
		Hashable<KeyType, InternalKeyType> {}

export type * as InternalHash from "./InternalHash/interfaces.js"
