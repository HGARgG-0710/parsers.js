import type { Summat } from "@hgargg-0710/summat.ts"
import type { Pattern } from "src/Pattern/interfaces.js"
import type { HashMapFastLookupTable, PersistentIndexFastLookupTable } from "./classes.js"
import type { FastLookupTableMutation, PersistentIndexMapMutation } from "./interfaces.js"
import type { Currable } from "src/Stream/BasicStream/interfaces.js"

// * PersistentIndexLooupTable

export function persistentIndexFastLookupTableOwn<KeyType = any, ValueType = any>(
	this: PersistentIndexFastLookupTable<KeyType, ValueType>,
	toBeOwned: Summat,
	_index: Pattern<number>
) {
	toBeOwned._index = _index
	return toBeOwned
}

export function persistentIndexFastLookupTableByOwned<KeyType = any, ValueType = any>(
	this: PersistentIndexFastLookupTable<KeyType, ValueType>,
	priorOwned: Summat
) {
	return this.table.byIndex(priorOwned._index.value)
}

export function persistentIndexFastLookupTableIndex<KeyType = any, ValueType = any>(
	this: PersistentIndexFastLookupTable<KeyType, ValueType>,
	key: KeyType
) {
	return this.table.index(key)
}

export function persistentIndexFastLookupTableSet<KeyType = any, ValueType = any>(
	this: PersistentIndexFastLookupTable<KeyType, ValueType>,
	key: KeyType,
	value: ValueType
) {
	this.table.set(key, value)
	return this
}

export function persistentIndexFastLookupTableDelete<KeyType = any, ValueType = any>(
	this: PersistentIndexFastLookupTable<KeyType, ValueType>,
	key: KeyType
) {
	this.table.delete(this.table.index(key)[0].value)
	return this
}

export function persistentIndexFastLookupTableReplaceKey<KeyType = any, ValueType = any>(
	this: PersistentIndexFastLookupTable<KeyType, ValueType>,
	keyFrom: KeyType,
	keyTo: KeyType
) {
	this.table.replaceKey(keyFrom, keyTo)
	return this
}

export function persistentIndexFastLookupTableMutate<KeyType = any, ValueType = any>(
	this: PersistentIndexFastLookupTable<KeyType, ValueType>,
	f: PersistentIndexMapMutation<KeyType, ValueType>
) {
	const table = this.table
	let i = table.size
	while (i--) table.set(table.keys[i], f(table.byIndex(i)[1][1], i, this))
	return this
}

// * HashMapFastLookupTable

export function hashMapFastLookupTableOwn<KeyType = any, ValueType = any>(
	this: HashMapFastLookupTable<KeyType, ValueType>,
	toBeOwned: Currable & Summat
) {
	toBeOwned._index = toBeOwned.curr
	return this
}

export function hashMapFastLookupTableByOwned<KeyType = any, ValueType = any>(
	this: HashMapFastLookupTable<KeyType, ValueType>,
	priorOwned: Summat
) {
	return this.hash.index(priorOwned._index)
}

export function hashMapFastLookupTableIndex<KeyType = any, ValueType = any>(
	this: HashMapFastLookupTable<KeyType, ValueType>,
	key: KeyType
) {
	return this.hash.index(key)
}

export function hashMapFastLookupTableSet<KeyType = any, ValueType = any>(
	this: HashMapFastLookupTable<KeyType, ValueType>,
	key: KeyType,
	value: ValueType
) {
	this.hash.set(key, value)
	return this
}

export function hashMapFastLookupTableDelete<KeyType = any, ValueType = any>(
	this: HashMapFastLookupTable<KeyType, ValueType>,
	key: KeyType
) {
	this.hash.delete(key)
	return this
}

export function hashMapFastLookupTableReplaceKey<KeyType = any, ValueType = any>(
	this: HashMapFastLookupTable<KeyType, ValueType>,
	keyFrom: KeyType,
	keyTo: KeyType
) {
	this.hash.replaceKey(keyFrom, keyTo)
	return this
}

export function hashMapFastLookupTableMutate<KeyType = any, ValueType = any>(
	this: HashMapFastLookupTable<KeyType, ValueType>,
	mutation: FastLookupTableMutation<KeyType, ValueType>
) {
	let i = 0
	this.hash.keys.forEach((key) =>
		this.set(key, mutation(this.hash.get(key), i++, this))
	)
	return this
}
