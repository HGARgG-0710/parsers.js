import type { Pattern } from "src/Pattern/interfaces.js"
import type { HashMap } from "../HashMap/interfaces.js"
import type { PersistentIndexMap } from "../PersistentIndexMap/interfaces.js"
import type { FastLookupTable, FastLookupTableMutation } from "./interfaces.js"
import type { SubHaving } from "../SubHaving/interfaces.js"
import {
	persistentIndexFastLookupTableByOwned,
	persistentIndexFastLookupTableDelete,
	persistentIndexFastLookupTableIndex,
	persistentIndexFastLookupTableMutate,
	hashMapFastLookupTableByOwned,
	persistentIndexFastLookupTableOwn,
	hashMapFastLookupTableOwn,
	hashMapFastLookupTableMutate,
	hashMapFastLookupTableIndex
} from "./methods.js"
import { subDelete, subSet, subReplaceKey } from "../SubHaving/methods.js"

import type { HashTableClass as HashTableClassType } from "./interfaces.js"

export class PersistentIndexFastLookupTable<KeyType = any, ValueType = any>
	implements
		FastLookupTable<KeyType, ValueType, Pattern<number>>,
		SubHaving<PersistentIndexMap<KeyType, ValueType>>
{
	sub: PersistentIndexMap<KeyType, ValueType>

	index: (x: any) => [Pattern<number>, KeyType, ValueType]
	own: (x: any, ownIndex: Pattern<number>) => void
	byOwned: (x: any) => [KeyType, ValueType]

	set: (key: KeyType, value: ValueType) => any
	delete: (key: KeyType) => any
	replaceKey: (keyFrom: KeyType, keyTo: KeyType) => any

	mutate: (mutation: FastLookupTableMutation<KeyType, ValueType>) => any

	constructor(subTable: PersistentIndexMap<KeyType, ValueType>) {
		this.sub = subTable
	}
}

Object.defineProperties(PersistentIndexFastLookupTable.prototype, {
	index: { value: persistentIndexFastLookupTableIndex },
	own: { value: persistentIndexFastLookupTableOwn },
	byOwned: { value: persistentIndexFastLookupTableByOwned },
	set: { value: subSet },
	delete: { value: persistentIndexFastLookupTableDelete },
	replaceKey: { value: subReplaceKey },
	mutate: { value: persistentIndexFastLookupTableMutate }
})

const HashTablePrototype = {
	index: { value: hashMapFastLookupTableIndex },
	own: { value: hashMapFastLookupTableOwn },
	byOwned: { value: hashMapFastLookupTableByOwned },
	set: { value: subSet },
	delete: { value: subDelete },
	replaceKey: { value: subReplaceKey },
	mutate: { value: hashMapFastLookupTableMutate }
}

export function HashTable<KeyType = any, ValueType = any, OwningType = any>(
	ownership: (x: KeyType) => OwningType
) {
	class HashTableClass implements HashTableClassType<KeyType, ValueType, OwningType> {
		sub: HashMap<KeyType, ValueType>

		index: (x: any) => [OwningType, KeyType, ValueType]
		own: (x: any, ownFunc: OwningType) => void
		byOwned: (x: any) => [KeyType, ValueType]
		set: (key: KeyType, value: ValueType) => any
		delete: (key: KeyType) => any
		replaceKey: (keyFrom: KeyType, keyTo: KeyType) => any

		mutate: (mutation: FastLookupTableMutation<KeyType, ValueType>) => any
		ownership: (x: KeyType) => OwningType

		constructor(baseHash: HashMap<KeyType, ValueType>) {
			this.sub = baseHash
		}
	}

	Object.defineProperties(HashTableClass.prototype, HashTablePrototype)
	HashTableClass.prototype.ownership = ownership

	return HashTableClass
}
