import type { HashMap } from "../HashMap/interfaces.js"
import type {
	PersistentIndexMap,
	PersistentIndexValue
} from "../PersistentIndexMap/interfaces.js"
import type {
	FastLookupTable,
	FastLookupTableMutation,
	PersistentIndexMapMutation
} from "./interfaces.js"
import {
	persistentIndexFastLookupTableByOwned,
	persistentIndexFastLookupTableDelete,
	persistentIndexFastLookupTableIndex,
	persistentIndexFastLookupTableMutate,
	persistentIndexFastLookupTableReplaceKey,
	persistentIndexFastLookupTableSet,
	hashMapFastLookupTableByOwned,
	persistentIndexFastLookupTableOwn,
	hashMapFastLookupTableOwn,
	hashMapFastLookupTableIndex,
	hashMapFastLookupTableSet,
	hashMapFastLookupTableDelete,
	hashMapFastLookupTableReplaceKey,
	hashMapFastLookupTableMutate
} from "./methods.js"

export class PersistentIndexFastLookupTable<KeyType = any, ValueType = any>
	implements FastLookupTable<KeyType, PersistentIndexValue<ValueType>>
{
	table: PersistentIndexMap<KeyType, ValueType>

	index: (x: any) => PersistentIndexValue<ValueType>
	own: (x: any) => void
	byOwned: (x: any) => void
	set: (key: KeyType, value: PersistentIndexValue<ValueType>) => any
	delete: (key: KeyType) => any
	replaceKey: (keyFrom: KeyType, keyTo: KeyType) => any

	mutate: PersistentIndexMapMutation<KeyType, ValueType>

	constructor(underTable: PersistentIndexMap<KeyType, ValueType>) {
		this.table = underTable
	}
}

Object.defineProperties(PersistentIndexFastLookupTable.prototype, {
	index: { value: persistentIndexFastLookupTableIndex },
	own: { value: persistentIndexFastLookupTableOwn },
	byOwned: { value: persistentIndexFastLookupTableByOwned },
	set: { value: persistentIndexFastLookupTableSet },
	delete: { value: persistentIndexFastLookupTableDelete },
	replaceKey: { value: persistentIndexFastLookupTableReplaceKey },
	mutate: { value: persistentIndexFastLookupTableMutate }
})

export class HashMapFastLookupTable<KeyType = any, ValueType = any>
	implements FastLookupTable<KeyType, ValueType>
{
	hash: HashMap<KeyType, ValueType>

	index: (x: any) => ValueType
	own: (x: any) => void
	byOwned: (x: any) => void
	set: (key: KeyType, value: ValueType) => any
	delete: (key: KeyType) => any
	replaceKey: (keyFrom: KeyType, keyTo: KeyType) => any

	mutate: FastLookupTableMutation<KeyType, ValueType>

	constructor(baseHash: HashMap<KeyType, ValueType>) {
		this.hash = baseHash
	}
}

Object.defineProperties(HashMapFastLookupTable.prototype, {
	index: { value: hashMapFastLookupTableIndex },
	own: { value: hashMapFastLookupTableOwn },
	byOwned: { value: hashMapFastLookupTableByOwned },
	set: { value: hashMapFastLookupTableSet },
	delete: { value: hashMapFastLookupTableDelete },
	replaceKey: { value: hashMapFastLookupTableReplaceKey },
	mutate: { value: hashMapFastLookupTableMutate }
})
