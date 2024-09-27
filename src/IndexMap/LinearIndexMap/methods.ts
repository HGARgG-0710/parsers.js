import type { IndexMap, Pairs } from "../interfaces.js"
import { fromPairsList } from "../utils.js"

import { inplace } from "@hgargg-0710/one"
const { insert, out } = inplace

export function linearIndexMapIndex<KeyType = any, ValueType = any>(
	this: IndexMap<KeyType, ValueType>,
	x: any
) {
	for (let i = 0; i < this.size; ++i)
		if (this.change(this.keys[i], x)) return this.values[i]
	return this.default
}

export function linearIndexMapReplace<KeyType = any, ValueType = any>(
	this: IndexMap<KeyType, ValueType>,
	index: number,
	pair: [KeyType, ValueType]
): IndexMap<KeyType, ValueType> {
	const [key, value] = pair
	this.keys[index] = key
	this.values[index] = value
	return this
}

export function linearIndexMapAdd<KeyType = any, ValueType = any>(
	this: IndexMap<KeyType, ValueType>,
	index: number,
	...pairs: Pairs<KeyType, ValueType>
): IndexMap<KeyType, ValueType> {
	const [keys, values] = fromPairsList(pairs)
	insert(this.keys, index, ...keys)
	insert(this.values, index, ...values)
	return this
}

export function linearIndexMapDelete<KeyType = any, ValueType = any>(
	this: IndexMap<KeyType, ValueType>,
	index: number,
	count: number = 1
): IndexMap<KeyType, ValueType> {
	out(this.keys, index, count)
	out(this.values, index, count)
	return this
}
