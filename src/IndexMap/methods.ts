import { toPairsList } from "./utils.js"
import type { IndexMap, MapClass as MapClassType } from "./interfaces.js"

import { inplace } from "@hgargg-0710/one"
import { LinearMapClass } from "./LinearIndexMap/classes.js"
import { table } from "./utils.js"
const { swap } = inplace

export function indexMapUnique<KeyType = any, ValueType = any>(
	this: IndexMap<KeyType, ValueType>,
	start: boolean = true
): IndexMap<KeyType, ValueType> {
	const eliminationSet = new Set()
	const indexSet = new Set()

	const predicate = start ? (i: number) => i < this.size : (i: number) => i >= 0
	const change = (-1) ** +!start

	for (let i = +!start * (this.size - 1); predicate(i); i += change)
		if (!eliminationSet.has(this.keys[i])) {
			eliminationSet.add(this.keys[i])
			indexSet.add(i)
		}

	const filterPredicate = (_x: any, i: number) => indexSet.has(i)
	this.keys = this.keys.filter(filterPredicate)
	this.values = this.values.filter(filterPredicate)

	return this
}

export function* indexMapIterator<KeyType = any, ValueType = any>(
	this: IndexMap<KeyType, ValueType>
): Generator<[KeyType, ValueType]> {
	const size = this.size
	for (let i = 0; i < size; ++i) yield [this.keys[i], this.values[i]]
}

export function indexMapByIndex<KeyType = any, ValueType = any>(
	this: IndexMap<KeyType, ValueType>,
	index: number
): [KeyType, ValueType] {
	return [this.keys[index], this.values[index]]
}

export function indexMapSwap<KeyType = any, ValueType = any>(
	this: IndexMap<KeyType, ValueType>,
	i: number,
	j: number
): IndexMap<KeyType, ValueType> {
	swap(this.keys, i, j)
	swap(this.values, i, j)
	return this
}

export function indexMapCopy<KeyType = any, ValueType = any>(
	this: IndexMap<KeyType, ValueType>
) {
	return new this.constructor(toPairsList(table(this)))
}

export function indexMapSizeGetter<KeyType = any, ValueType = any>(
	this: IndexMap<KeyType, ValueType>
) {
	return this.keys.length
}

export function indexMapSet<KeyType = any, ValueType = any>(
	this: IndexMap<KeyType, ValueType>,
	key: KeyType,
	value: ValueType,
	index: number = this.size
) {
	const keyIndex = this.keys.indexOf(key)
	if (keyIndex > -1) {
		this.values[keyIndex] = value
		return this
	}
	return this.add(index, [key, value])
}

export function mapClassExtend<KeyType = any, ValueType = any>(
	this: MapClassType<KeyType, ValueType>,
	f: (x: ValueType) => any
): MapClassType<KeyType, any> {
	return LinearMapClass<KeyType>((curr: KeyType, x: any) => this.change(curr, f(x)))
}

export function mapClassExtendKey<KeyType = any, ValueType = any>(
	this: MapClassType<KeyType, ValueType>,
	f: (x: KeyType) => any
): MapClassType<any, ValueType> {
	return LinearMapClass((curr: any, x: any) => this.change(f(curr), x))
}

export * as HashMap from "./HashMap/methods.js"
export * as LinearIndexMap from "./LinearIndexMap/methods.js"
export * as PersistentIndexMap from "./PersistentIndexMap/methods.js"
