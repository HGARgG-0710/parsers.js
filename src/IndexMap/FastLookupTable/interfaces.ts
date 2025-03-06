import type { Deletable, HashMap, Settable } from "../HashMap/interfaces.js"
import type { KeyReplaceable } from "../HashMap/interfaces.js"

export interface FastLookupTable<KeyType = any, ValueType = any, OwningType = any>
	extends KeyReplaceable<KeyType>,
		Settable<KeyType, ValueType>,
		Deletable<KeyType> {
	getIndex: (x: any) => OwningType
	own: (x: any, ownType: OwningType) => void
	byOwned: (x: any) => ValueType
	isOwned: (x: any) => boolean
}

export interface IndexAssignable<Type = any> {
	assignedIndex?: Type
}

export type TableConstructor = new <KeyType = any, ValueType = any>(
	hash: HashMap<KeyType, ValueType>
) => FastLookupTable<KeyType, ValueType>
