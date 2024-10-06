import type { Deletable, HashMap, Settable } from "../HashMap/interfaces.js"
import type { KeyReplaceable } from "../HashMap/interfaces.js"
import type { SubHaving } from "../SubHaving/interfaces.js"

export interface FastLookupTable<KeyType = any, ValueType = any, OwningType = any>
	extends KeyReplaceable<KeyType>,
		Settable<KeyType, ValueType>,
		Deletable<KeyType> {
	getIndex: (x: any) => OwningType
	own: (x: any, ownType: OwningType) => void
	byOwned: (x: any) => ValueType
}

export interface HashTableClass<KeyType = any, ValueType = any, OwningType = any>
	extends FastLookupTable<KeyType, ValueType, OwningType>,
		SubHaving<HashMap<KeyType, ValueType>> {}
