import type { IIndexable } from "src/interfaces.js"
import type {
	ICopiable,
	IDefaulting,
	IDeletable,
	IHashable,
	IRekeyable,
	ISettable,
	ISizeable
} from "../interfaces.js"
import type { IInternalHash } from "../HashMap/interfaces/InternalHash.js"

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
	): IHashMap<KeyType, ValueType, DefaultType>

	extend: (
		f: (x: any) => KeyType
	) => IHashClass<any, ValueType, InternalKeyType>
}

export interface IHashMap<KeyType = any, ValueType = any, DefaultType = any>
	extends IIndexable<ValueType | DefaultType>,
		ISettable<KeyType, ValueType | DefaultType>,
		IDeletable<KeyType>,
		IRekeyable<KeyType>,
		ISizeable,
		IDefaulting,
		ICopiable {}

export type * from "../HashMap/interfaces/InternalHash.js"
