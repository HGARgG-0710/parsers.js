import type { Pattern } from "../../Pattern/interfaces.js"
import type { HashMap } from "../HashMap/interfaces.js"
import type { PersistentIndexMap } from "../PersistentIndexMap/interfaces.js"
import type { FastLookupTable, HashTable } from "./interfaces.js"

import {
	valueDelete,
	valueSet,
	valueReplaceKey,
	valueGetIndex
} from "../../Pattern/methods.js"

import { BasicPattern } from "../../Pattern/classes.js"

import {
	persistentIndexFastLookupTableByOwned,
	persistentIndexFastLookupTableDelete,
	hashMapFastLookupTableByOwned,
	affirmOwnership
} from "./methods.js"

import { current, extendClass } from "../../utils.js"

import { function as _f } from "@hgargg-0710/one"
const { id } = _f

export class PersistentIndexFastLookupTable<KeyType = any, ValueType = any>
	extends BasicPattern<PersistentIndexMap<KeyType, ValueType>>
	implements FastLookupTable<KeyType, ValueType, Pattern<number>>
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

extendClass(PersistentIndexFastLookupTable, {
	getIndex: { value: valueGetIndex },
	own: { value: affirmOwnership },
	byOwned: { value: persistentIndexFastLookupTableByOwned },
	set: { value: valueSet },
	delete: { value: persistentIndexFastLookupTableDelete },
	replaceKey: { value: valueReplaceKey }
})

const HashTablePrototype = {
	own: { value: affirmOwnership },
	byOwned: { value: hashMapFastLookupTableByOwned },
	set: { value: valueSet },
	delete: { value: valueDelete },
	replaceKey: { value: valueReplaceKey }
}

export function HashTable<KeyType = any, ValueType = any, OwningType = any>(
	ownership: (x: any) => OwningType
) {
	class HashTableClass
		extends BasicPattern<HashMap<KeyType, ValueType>>
		implements HashTable<KeyType, ValueType, OwningType>
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

	extendClass(HashTableClass, HashTablePrototype)
	HashTableClass.prototype.getIndex = ownership

	return HashTableClass
}

type HashConstructor = new <KeyType = any, ValueType = any>(
	hash: HashMap<KeyType, ValueType>
) => HashTable<KeyType, ValueType>

export const [BasicHashTable, StreamHashTable]: [HashConstructor, HashConstructor] = [
	id,
	current
].map(HashTable) as [any, any]
