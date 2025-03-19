import type { IInternalHash } from "./InternalHash/interfaces.js"
import type { IIndexable } from "../interfaces.js"
import type {
	IDeletable,
	IHashable,
	IRekeyable,
	ISettable,
	ISizeable
} from "../../interfaces.js"

export type IHash<KeyType = any, InternalKeyType = any> = (
	x: KeyType,
	...y: any[]
) => InternalKeyType

export interface IHashClass<
	KeyType = any,
	ValueType = any,
	InternalKeyType = any,
	DefaultType = any
> extends IHashable<KeyType, InternalKeyType> {
	new (
		structure: IInternalHash<InternalKeyType, ValueType, DefaultType>
	): IHashMap<KeyType, ValueType, InternalKeyType>
	extend: (
		f: (x: any) => KeyType
	) => IHashClass<any, ValueType, InternalKeyType>
}

export interface IHashMap<
	KeyType = any,
	ValueType = any,
	InternalKeyType = any,
	DefaultType = any
> extends IIndexable<ValueType | DefaultType>,
		ISettable<KeyType, ValueType | DefaultType>,
		IDeletable<KeyType>,
		IRekeyable<KeyType>,
		ISizeable,
		IHashable<KeyType, InternalKeyType> {}

export type * from "./InternalHash/interfaces.js"
