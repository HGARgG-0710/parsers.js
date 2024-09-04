import { fromPairsList } from "./utils.js"
import type { IndexMap } from "./interfaces.js"

import { inplace } from "@hgargg-0710/one"
const { insert } = inplace

// * 'IndexMap' methods
export function indexMapIndex<KeyType = any, ValueType = any>(
	this: IndexMap<KeyType, ValueType>,
	x: any
) {
	let current = this.default
	for (let i = this.keys.length; i--; ) {
		const index = this.keys.length - 1 - i
		if (this.change(this.keys[index], x)) {
			current = this.values[index]
			break
		}
	}
	return current
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
	...pairs: [KeyType, ValueType][]
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
	for (let k = this.keys.length; k--; ) {
		const index = this.keys.length - 1 - k
		yield [this.keys[index], this.values[index]]
	}
}

export function indexMapByIndex<KeyType = any, ValueType = any>(
	this: IndexMap<KeyType, ValueType>,
	index: number
): [KeyType, ValueType] {
	return [this.keys[index], this.values[index]]
}
