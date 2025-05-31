import type { array } from "@hgargg-0710/one"
import type { IIndexable } from "../interfaces.js"
import type {
	ICopiable,
	IDefaulting,
	IDeletable,
	IHashable,
	IRekeyable,
	ISettable,
	ISizeable
} from "../interfaces.js"
import type { IPreMap } from "../modules/HashMap/interfaces/PreMap.js"

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
	new (structure: IPreMap<InternalKeyType, ValueType, DefaultType>): IHashMap<
		KeyType,
		ValueType,
		DefaultType
	>

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
		ICopiable {
	fromPairs(pairsList: array.Pairs<KeyType, ValueType>): this
}

export type * from "../modules/HashMap/interfaces/PreMap.js"
