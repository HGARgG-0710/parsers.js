import type { IInternalHash } from "./InternalHash/interfaces.js"
import type { Indexable } from "../interfaces.js"
import type {
	Deletable,
	Hashable,
	Rekeyable,
	Settable,
	Sizeable
} from "src/interfaces.js"

export type Hash<KeyType = any, InternalKeyType = any> = (
	x: KeyType,
	...y: any[]
) => InternalKeyType

export interface IHashClass<
	KeyType = any,
	ValueType = any,
	InternalKeyType = any,
	DefaultType = any
> extends Hashable<KeyType, InternalKeyType> {
	new (structure: IInternalHash<InternalKeyType, ValueType, DefaultType>): HashMap<
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
		Rekeyable<KeyType>,
		Sizeable,
		Hashable<KeyType, InternalKeyType> {}

export type * from "./InternalHash/interfaces.js"
