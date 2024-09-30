import type { Deletable, Settable } from "../HashMap/interfaces.js"
import type { KeyReplaceable } from "../HashMap/interfaces.js"
import type { Indexable } from "../interfaces.js"
import type { PersistentIndexValue } from "../PersistentIndexMap/interfaces.js"

export interface FastLookupTable<KeyType = any, ValueType = any>
	extends Indexable<ValueType>,
		KeyReplaceable<KeyType>,
		Settable<KeyType, ValueType>,
		Deletable<KeyType> {
	own: (x: any) => void
	byOwned: (x: any) => void
}

export type FastLookupTableMutation<KeyType = any, ValueType = any> = (
	value: ValueType,
	i?: number,
	table?: FastLookupTable<KeyType, ValueType>
) => any

export type PersistentIndexMapMutation<KeyType = any, ValueType = any> = (
	value: ValueType,
	i?: number,
	table?: FastLookupTable<KeyType, PersistentIndexValue<ValueType>>
) => any
