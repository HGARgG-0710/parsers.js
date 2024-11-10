import type { Summat } from "@hgargg-0710/summat.ts"
import type { FastLookupTable } from "./interfaces.js"
import type { PersistentIndexFastLookupTable } from "./classes.js"

import { AssignmentClass } from "../../utils.js"

// * general

export const affirmOwnership = AssignmentClass<any>("_index")

// * PersistentIndexLooupTable

export function persistentIndexFastLookupTableByOwned<KeyType = any, ValueType = any>(
	this: PersistentIndexFastLookupTable<KeyType, ValueType>,
	priorOwned: Summat
) {
	return this.value.byIndex(priorOwned._index.value)[1]
}

export function persistentIndexFastLookupTableDelete<KeyType = any, ValueType = any>(
	this: PersistentIndexFastLookupTable<KeyType, ValueType>,
	key: KeyType
) {
	const sub = this.value
	sub.delete(sub.getIndex(key).value)
	return this
}

// * HashMapFastLookupTable

export function hashMapFastLookupTableByOwned<KeyType = any, ValueType = any>(
	this: FastLookupTable<KeyType, ValueType>,
	priorOwned: Summat
) {
	return this.value.index(priorOwned._index)
}
