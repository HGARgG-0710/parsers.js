import type { Summat } from "@hgargg-0710/summat.ts"
import type { Pattern } from "src/Pattern/interfaces.js"
import type { PersistentIndexFastLookupTable } from "./classes.js"
import type { FastLookupTableMutation, HashTableClass } from "./interfaces.js"

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

export function persistentIndexFastLookupTableMutate<KeyType = any, ValueType = any>(
	this: PersistentIndexFastLookupTable<KeyType, ValueType>,
	f: FastLookupTableMutation<KeyType, ValueType>
) {
	const table = this.sub
	let i = table.size
	while (i--) table.set(table.keys[i], f(table.values[i], i, this))
	return this
}

// * HashMapFastLookupTable

export function hashMapFastLookupTableOwn<
	KeyType = any,
	ValueType = any,
	OwningType = any
>(
	this: HashTableClass<KeyType, ValueType, OwningType>,
	toBeOwned: Summat,
	ownType: OwningType
) {
	toBeOwned._index = ownType
	return this
}

export function hashMapFastLookupTableByOwned<KeyType = any, ValueType = any>(
	this: HashTableClass<KeyType, ValueType>,
	priorOwned: Summat
) {
	return this.sub.index(priorOwned._index)
}

export function hashMapFastLookupTableMutate<
	KeyType = any,
	ValueType = any,
	OwningType = any
>(
	this: HashTableClass<KeyType, ValueType>,
	mutation: FastLookupTableMutation<KeyType, ValueType, OwningType>
) {
	let i = 0
	this.sub.keys.forEach((key) => this.set(key, mutation(this.sub.get(key), i++, this)))
	return this
}
