import type { IHashMap } from "../HashMap/interfaces.js"
import type { IDeletable, ISettable, IRekeyable } from "../../interfaces.js"

export interface ILookupTable<KeyType = any, ValueType = any, OwningType = any>
	extends IRekeyable<KeyType>,
		ISettable<KeyType, ValueType>,
		IDeletable<KeyType> {
	getIndex: (x: any) => OwningType
	own: (x: any, ownType: OwningType) => void
	byOwned: (x: any) => ValueType
	isOwned: (x: any) => boolean
}

export type ITableConstructor<OwningType = any> = new <
	KeyType = any,
	ValueType = any
>(
	hash: IHashMap<KeyType, ValueType>
) => ILookupTable<KeyType, ValueType, OwningType>
