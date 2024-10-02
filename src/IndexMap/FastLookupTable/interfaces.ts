import type { Summat } from "@hgargg-0710/summat.ts"
import type { Deletable, HashMap, Settable } from "../HashMap/interfaces.js"
import type { KeyReplaceable } from "../HashMap/interfaces.js"
import type { SubHaving } from "../SubHaving/interfaces.js"

export interface Mutable extends Summat {
	mutate: (f: Function) => any
}

export interface FastLookupTable<KeyType = any, ValueType = any, OwningType = any>
	extends Mutable,
		KeyReplaceable<KeyType>,
		Settable<KeyType, ValueType>,
		Deletable<KeyType> {
	index: (x: any) => [OwningType, KeyType, ValueType]
	own: (x: any, ownType: OwningType) => void
	byOwned: (x: any) => [KeyType, ValueType]
}

export interface HashTableClass<KeyType = any, ValueType = any, OwningType = any>
	extends FastLookupTable<KeyType, ValueType, OwningType>,
		SubHaving<HashMap<KeyType, ValueType>> {
	ownership: (x: KeyType) => OwningType
}

export type FastLookupTableMutation<KeyType = any, ValueType = any, OwningType = any> = (
	value: ValueType,
	i?: number,
	table?: FastLookupTable<KeyType, ValueType, OwningType>
) => any
