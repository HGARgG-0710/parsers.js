import { fromPairsList, toPairsList } from "./utils.js"
import type { IndexMap, MapClass as MapClassType, Pairs } from "./interfaces.js"

import { inplace } from "@hgargg-0710/one"
import { MapClass } from "./classes.js"
import { table } from "./utils.js"
const { insert, swap } = inplace

export function indexMapIndex<KeyType = any, ValueType = any>(
	this: IndexMap<KeyType, ValueType>,
	x: any
) {
	for (let i = 0; i < this.keys.length; ++i)
		if (this.change(this.keys[i], x)) return this.values[i]
	return this.default
}

export function indexMapReplace<KeyType = any, ValueType = any>(
	this: IndexMap<KeyType, ValueType>,
	index: number,
	pair: [KeyType, ValueType]
): IndexMap<KeyType, ValueType> {
	const [key, value] = pair
	this.keys[index] = key
	this.values[index] = value
	return this
}

export function indexMapAdd<KeyType = any, ValueType = any>(
	this: IndexMap<KeyType, ValueType>,
	index: number,
	...pairs: Pairs<KeyType, ValueType>
): IndexMap<KeyType, ValueType> {
	const [keys, values] = fromPairsList(pairs)
	insert(this.keys, index, ...keys)
	insert(this.values, index, ...values)
	return this
}

export function indexMapDelete<KeyType = any, ValueType = any>(
	this: IndexMap<KeyType, ValueType>,
	index: number
): IndexMap<KeyType, ValueType> {
	this.keys.splice(index, 1)
	this.values.splice(index, 1)
	return this
}

export function indexMapUnique<KeyType = any, ValueType = any>(
	this: IndexMap<KeyType, ValueType>,
	start: boolean = true
): IndexMap<KeyType, ValueType> {
	const indexSet = new Set()
	const predicate = start ? (i: number) => i < this.keys.length : (i: number) => i >= 0
	const change = (-1) ** +!start

	for (let i = +!start * this.keys.length; predicate(i); i += change)
		if (!indexSet.has(this.keys[i])) indexSet.add(i)

	const filterPredicate = (_x: any, i: number) => indexSet.has(i)
	this.keys = this.keys.filter(filterPredicate)
	this.values = this.values.filter(filterPredicate)

	return this
}

export function* indexMapIterator<KeyType = any, ValueType = any>(
	this: IndexMap<KeyType, ValueType>
): Generator<[KeyType, ValueType]> {
	for (let i = 0; i < this.keys.length; ++i) yield [this.keys[i], this.values[i]]
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
	return MapClass<KeyType, ValueType>(this.change)(toPairsList(table(this)))
}
export function mapClassExtend<KeyType = any, ValueType = any>(
	this: MapClassType<KeyType, ValueType>,
	f: (x: ValueType) => any
): MapClassType<KeyType, any> {
	return MapClass<KeyType>((curr: KeyType, x: any) => this.change(curr, f(x)))
}

export function mapClassExtendKey<KeyType = any, ValueType = any>(
	this: MapClassType<KeyType, ValueType>,
	f: (x: KeyType) => any
): MapClassType<any, ValueType> {
	return MapClass((curr: any, x: any) => this.change(f(curr), x))
}
