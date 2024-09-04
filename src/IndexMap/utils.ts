import { MapClass } from "./classes.js"
import type { IndexingFunction, IndexMap } from "./interfaces.js"
import type {
	Indexable,
	MapClassKeyExtension,
	MapClassValueExtension
} from "./interfaces.js"

import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type

export const isIndexable = structCheck<Indexable>({ index: isFunction })

export function mapClassExtend<KeyType = any, ValueType = any>(
	change: IndexingFunction<KeyType>
): MapClassValueExtension<KeyType, ValueType> {
	return (f) => MapClass<KeyType>((curr: KeyType, x: any) => change(curr, f(x)))
}
export function mapClassExtendKey<KeyType = any, ValueType = any>(
	change: IndexingFunction<KeyType>
): MapClassKeyExtension<KeyType, ValueType> {
	return (f) => MapClass((curr: any, x: any) => change(f(curr), x))
}
export function table<KeyType = any, OutType = any>(
	indexMap: IndexMap<KeyType, OutType>
): [KeyType[], OutType[]] {
	return [indexMap.keys, indexMap.values]
}

export function fromPairsList<KeyType = any, ValueType = any>(
	mapPairs: [KeyType, ValueType][]
): [KeyType[], ValueType[]] {
	const keys = []
	const values = []
	for (const [key, value] of mapPairs) {
		keys.push(key)
		values.push(value)
	}
	return [keys, values]
}
