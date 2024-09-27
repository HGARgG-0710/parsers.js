import type { Pairs } from "../interfaces.js"
import { Pointer } from "./classes.js"
import type { PersistentIndexValue, PersistentIndexMap } from "./interfaces.js"

export function persistentIndexMapAdd<KeyType = any, ValueType = any>(
	this: PersistentIndexMap<KeyType, ValueType>,
	index: number,
	...pairs: Pairs<KeyType, ValueType>
) {
	const increase = pairs.length
	for (let i = index; i < this.size; ++i) this.values[i][0].value += increase
	const withPointers = pairs.map(([key, value], i) => [
		key,
		[Pointer(index + i), value]
	]) as Pairs<KeyType, PersistentIndexValue<ValueType>>
	this.indexMap.add(index, ...withPointers)
	return this
}

export function persistentIndexMapKeysGetter<KeyType = any, ValueType = any>(
	this: PersistentIndexMap<KeyType, ValueType>
) {
	return this.indexMap.keys
}

export function persistentIndexMapValuesGetter<KeyType = any, ValueType = any>(
	this: PersistentIndexMap<KeyType, ValueType>
) {
	return this.indexMap.values
}

export function persistentIndexMapDefault<KeyType = any, ValueType = any>(
	this: PersistentIndexMap<KeyType, ValueType>
) {
	return this.indexMap.default
}

export function persistentIndexMapIndex<KeyType = any, ValueType = any>(
	this: PersistentIndexMap<KeyType, ValueType>,
	x: any
) {
	return this.indexMap.index(x)
}

export function persistentIndexMapByIndex<KeyType = any, ValueType = any>(
	this: PersistentIndexMap<KeyType, ValueType>,
	i: number
) {
	return this.indexMap.byIndex(i)
}

export function persistentIndexMapReplace<KeyType = any, ValueType = any>(
	this: PersistentIndexMap<KeyType, ValueType>,
	index: number,
	pair: [KeyType, ValueType]
) {
	this.indexMap.replace(index, [pair[0], [this.byIndex(index)[1][0], pair[1]]])
	return this
}

export function persistentIndexMapDelete<KeyType = any, ValueType = any>(
	this: PersistentIndexMap<KeyType, ValueType>,
	index: number,
	count: number = 1
) {
	for (let i = index + count; i < this.size; ++i) this.values[i][0].value -= count
	this.indexMap.delete(index, count)
	return this
}

export function persistentIndexMapUnique<KeyType = any, ValueType = any>(
	this: PersistentIndexMap<KeyType, ValueType>,
	start: boolean = true
) {
	const keySet = new Set()
	const indexSet = new Set()

	const predicate = start ? (i: number) => i < this.size : (i: number) => i >= 0
	const change = (-1) ** +!start

	for (let i = +!start * (this.size - 1); predicate(i); i += change)
		if (!keySet.has(this.keys[i])) {
			keySet.add(this.keys[i])
			indexSet.add(i)
		}

	const filterPredicate = (_x: any, i: number) => indexSet.has(i)
	this.keys = this.keys.filter(filterPredicate)
	this.values = this.values.filter(filterPredicate)

	let i = this.size
	while (i--) this.values[i][0].value = i

	return this
}

export function persistentIndexMapSwap<KeyType = any, ValueType = any>(
	this: PersistentIndexMap<KeyType, ValueType>,
	i: number,
	j: number
) {
	const tempInt = this.values[i][0].value
	this.values[i][0].value = this.value[j][0].value
	this.values[j][0].value = tempInt
	this.indexMap.swap(i, j)
	return this
}
