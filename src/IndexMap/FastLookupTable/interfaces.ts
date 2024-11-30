import type { Deletable, Settable } from "../HashMap/interfaces.js"
import type { KeyReplaceable } from "../HashMap/interfaces.js"

export interface FastLookupTable<KeyType = any, ValueType = any, OwningType = any>
	extends KeyReplaceable<KeyType>,
		Settable<KeyType, ValueType>,
		Deletable<KeyType> {
	getIndex: (x: any) => OwningType
	own: (x: any, ownType: OwningType) => void
	byOwned: (x: any) => ValueType
}

export interface IndexAssignable<Type = any> {
	assignedIndex: Type
}
