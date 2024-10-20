import type { Pattern } from "../../Pattern/interfaces.js"
import type { HashMap } from "../HashMap/interfaces.js"
import type { PersistentIndexMap } from "../PersistentIndexMap/interfaces.js"
import type { SubHaving } from "../SubHaving/interfaces.js"
import type {
	FastLookupTable,
	HashTableClass as HashTableClassType
} from "./interfaces.js"

import { subDelete, subSet, subReplaceKey, subGetIndex } from "../SubHaving/methods.js"
import {
	persistentIndexFastLookupTableByOwned,
	persistentIndexFastLookupTableDelete,
	hashMapFastLookupTableByOwned,
	affirmOwnership
} from "./methods.js"

import { BasicSubHaving } from "../SubHaving/classes.js"

export class PersistentIndexFastLookupTable<KeyType = any, ValueType = any>
	extends BasicSubHaving<PersistentIndexMap<KeyType, ValueType>>
	implements
		FastLookupTable<KeyType, ValueType, Pattern<number>>,
		SubHaving<PersistentIndexMap<KeyType, ValueType>>
{
	getIndex: (x: any) => Pattern<number>
	own: (x: any, ownIndex: Pattern<number>) => void
	byOwned: (x: any) => ValueType

	set: (key: KeyType, value: ValueType) => any
	delete: (key: KeyType) => any
	replaceKey: (keyFrom: KeyType, keyTo: KeyType) => any

	constructor(table: PersistentIndexMap<KeyType, ValueType>) {
		super(table)
	}
}

Object.defineProperties(PersistentIndexFastLookupTable.prototype, {
	getIndex: { value: subGetIndex },
	own: { value: affirmOwnership },
	byOwned: { value: persistentIndexFastLookupTableByOwned },
	set: { value: subSet },
	delete: { value: persistentIndexFastLookupTableDelete },
	replaceKey: { value: subReplaceKey }
})

const HashTablePrototype = {
	own: { value: affirmOwnership },
	byOwned: { value: hashMapFastLookupTableByOwned },
	set: { value: subSet },
	delete: { value: subDelete },
	replaceKey: { value: subReplaceKey }
}

export function HashTable<KeyType = any, ValueType = any, OwningType = any>(
	ownership: (x: KeyType) => OwningType
) {
	class HashTableClass
		extends BasicSubHaving<HashMap<KeyType, ValueType>>
		implements HashTableClassType<KeyType, ValueType, OwningType>
	{
		getIndex: (x: any) => OwningType
		own: (x: any, ownFunc: OwningType) => void
		byOwned: (x: any) => ValueType
		set: (key: KeyType, value: ValueType) => any
		delete: (key: KeyType) => any
		replaceKey: (keyFrom: KeyType, keyTo: KeyType) => any

		constructor(hash: HashMap<KeyType, ValueType>) {
			super(hash)
		}
	}

	Object.defineProperties(HashTableClass.prototype, HashTablePrototype)
	HashTableClass.prototype.getIndex = ownership

	return HashTableClass
}

export const [BasicHashTable, StreamHashTable]: [HashTableClassType, HashTableClassType] =
	[(x: any) => x, (stream: any) => stream.curr].map(HashTable) as [any, any]
