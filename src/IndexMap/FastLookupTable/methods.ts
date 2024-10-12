import type { Summat } from "@hgargg-0710/summat.ts"
import type { PersistentIndexFastLookupTable } from "./classes.js"
import type { HashTableClass } from "./interfaces.js"

import { AssignmentClass } from "../../utils.js"

// * general

export const affirmOwnership = AssignmentClass<any>("_index")

// * PersistentIndexLooupTable

export function persistentIndexFastLookupTableByOwned<KeyType = any, ValueType = any>(
	this: PersistentIndexFastLookupTable<KeyType, ValueType>,
	priorOwned: Summat
) {
	return this.sub.byIndex(priorOwned._index.value)[1]
}

export function persistentIndexFastLookupTableDelete<KeyType = any, ValueType = any>(
	this: PersistentIndexFastLookupTable<KeyType, ValueType>,
	key: KeyType
) {
	const sub = this.sub
	sub.delete(sub.getIndex(key).value)
	return this
}

// * HashMapFastLookupTable

export function hashMapFastLookupTableByOwned<KeyType = any, ValueType = any>(
	this: HashTableClass<KeyType, ValueType>,
	priorOwned: Summat
) {
	return this.sub.index(priorOwned._index)
}
