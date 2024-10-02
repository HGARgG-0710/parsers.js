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
): [KeyType, ValueType] {
	return this.sub.byIndex(priorOwned._index.value)
}

export function persistentIndexFastLookupTableIndex<KeyType = any, ValueType = any>(
	this: PersistentIndexFastLookupTable<KeyType, ValueType>,
	key: KeyType
) {
	const [lowKey, value] = this.sub.index(key)
	return [this.sub.getIndex(lowKey), lowKey, value]
}

export function persistentIndexFastLookupTableDelete<KeyType = any, ValueType = any>(
	this: PersistentIndexFastLookupTable<KeyType, ValueType>,
	key: KeyType
) {
	this.sub.delete(this.sub.getIndex(key).value)
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

export function hashMapFastLookupTableIndex<
	KeyType = any,
	ValueType = any,
	OwningType = any
>(this: HashTableClass<KeyType, ValueType, OwningType>, key: KeyType) {
	const [lowKey, value] = this.sub.index(key)
	return [this.ownership(key), lowKey, value] as [OwningType, KeyType, ValueType]
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
