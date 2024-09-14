import type { IndexMap, Pairs } from "./interfaces.js"
import type { Indexable } from "./interfaces.js"

import { object, typeof as type, boolean } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction, isArray } = type
const { T } = boolean

export const isIndexable = structCheck<Indexable>({ index: isFunction })

export function table<KeyType = any, OutType = any>(
	indexMap: IndexMap<KeyType, OutType>
): [KeyType[], OutType[]] {
	return [indexMap.keys, indexMap.values]
}

export function fromPairsList<KeyType = any, ValueType = any>(
	mapPairs: Pairs<KeyType, ValueType>
): [KeyType[], ValueType[]] {
	let size = mapPairs.length
	const [keys, values]: [KeyType[], ValueType[]] = [
		Array(size).fill(null),
		Array(size).fill(null)
	]
	while (size--) {
		keys[size] = mapPairs[size][0]
		values[size] = mapPairs[size][1]
	}
	return [keys, values]
}

export function toPairsList<KeyType = any, ValueType = any>(
	keyValues: [KeyType[], ValueType[]]
): Pairs<KeyType, ValueType> {
	const [keys, values] = keyValues
	let size = keys.length
	const result: Pairs<KeyType, ValueType> = Array.from({ length: size }, () =>
		Array(2)
	) as [KeyType, ValueType][]
	while (size--) {
		result[size][0] = keys[size]
		result[size][1] = values[size]
	}
	return result
}

export const isIndexMap = structCheck<IndexMap>({
	keys: isArray,
	values: isArray,
	change: isFunction,
	index: isFunction,
	add: isFunction,
	delete: isFunction,
	replace: isFunction,
	unique: isFunction,
	byIndex: isFunction,
	swap: isFunction,
	copy: isFunction,
	default: T
})
