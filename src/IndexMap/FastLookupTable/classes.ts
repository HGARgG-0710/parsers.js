import type { Pattern } from "../../Pattern/interfaces.js"
import type { HashMap } from "../HashMap/interfaces.js"
import type { PersistentIndexMap } from "../PersistentIndexMap/interfaces.js"
import type { FastLookupTable } from "./interfaces.js"
import type { SubHaving } from "../SubHaving/interfaces.js"
import {
	persistentIndexFastLookupTableByOwned,
	persistentIndexFastLookupTableDelete,
	hashMapFastLookupTableByOwned,
	persistentIndexFastLookupTableOwn,
	hashMapFastLookupTableOwn
} from "./methods.js"
import { subDelete, subSet, subReplaceKey, subGetIndex } from "../SubHaving/methods.js"

import type { HashTableClass as HashTableClassType } from "./interfaces.js"

export class PersistentIndexFastLookupTable<KeyType = any, ValueType = any>
	implements
		FastLookupTable<KeyType, ValueType, Pattern<number>>,
		SubHaving<PersistentIndexMap<KeyType, ValueType>>
{
	sub: PersistentIndexMap<KeyType, ValueType>

	getIndex: (x: any) => Pattern<number>
	own: (x: any, ownIndex: Pattern<number>) => void
	byOwned: (x: any) => ValueType

	set: (key: KeyType, value: ValueType) => any
	delete: (key: KeyType) => any
	replaceKey: (keyFrom: KeyType, keyTo: KeyType) => any

	constructor(subTable: PersistentIndexMap<KeyType, ValueType>) {
		this.sub = subTable
	}
}

Object.defineProperties(PersistentIndexFastLookupTable.prototype, {
	getIndex: { value: subGetIndex },
	own: { value: persistentIndexFastLookupTableOwn },
	byOwned: { value: persistentIndexFastLookupTableByOwned },
	set: { value: subSet },
	delete: { value: persistentIndexFastLookupTableDelete },
	replaceKey: { value: subReplaceKey }
})

const HashTablePrototype = {
	own: { value: hashMapFastLookupTableOwn },
	byOwned: { value: hashMapFastLookupTableByOwned },
	set: { value: subSet },
	delete: { value: subDelete },
	replaceKey: { value: subReplaceKey }
}

export function HashTable<KeyType = any, ValueType = any, OwningType = any>(
	ownership: (x: KeyType) => OwningType
) {
	class HashTableClass implements HashTableClassType<KeyType, ValueType, OwningType> {
		sub: HashMap<KeyType, ValueType>

		getIndex: (x: any) => OwningType
		own: (x: any, ownFunc: OwningType) => void
		byOwned: (x: any) => ValueType
		set: (key: KeyType, value: ValueType) => any
		delete: (key: KeyType) => any
		replaceKey: (keyFrom: KeyType, keyTo: KeyType) => any

		constructor(baseHash: HashMap<KeyType, ValueType>) {
			this.sub = baseHash
		}
	}

	Object.defineProperties(HashTableClass.prototype, HashTablePrototype)
	HashTableClass.prototype.getIndex = ownership

	return HashTableClass
}

export const [BasicHashTable, StreamHashTable]: [HashTableClassType, HashTableClassType] =
	[(x: any) => x, (stream: any) => stream.curr].map(HashTable) as [any, any]
