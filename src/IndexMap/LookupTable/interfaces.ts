import type { IHashMap } from "../HashMap/interfaces.js"
import type {
	IDeletable,
	ISettable,
	IRekeyable,
	ISizeable,
	ICopiable
} from "../../interfaces.js"

export interface ILookupTable<KeyType = any, ValueType = any, OwningType = any>
	extends IRekeyable<KeyType>,
		ISettable<KeyType, ValueType>,
		IDeletable<KeyType>,
		ISizeable,
		ICopiable<ILookupTable<KeyType, ValueType, OwningType>> {
	claim: (x: any) => OwningType | null
	byOwned: (x: any) => ValueType
	isOwned: (x: any) => boolean
}

export type ITableConstructor<OwningType = any> = new <
	KeyType = any,
	ValueType = any,
	DefaultType = any
>(
	hash: IHashMap<KeyType, ValueType, DefaultType>
) => ILookupTable<KeyType, ValueType, OwningType>
