import type { IndexMap, Pairs } from "./interfaces.js"

export function table<KeyType = any, OutType = any>(
	indexMap: IndexMap<KeyType, OutType>
): [KeyType[], OutType[]] {
	return [indexMap.keys, indexMap.values]
}

export function fromPairsList<KeyType = any, ValueType = any>(
	mapPairs: Pairs<KeyType, ValueType>
): [KeyType[], ValueType[]] {
	let size = mapPairs.length
	const [keys, values]: [KeyType[], ValueType[]] = [new Array(size), new Array(size)]
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

	const result = Array.from({ length: size }, () => new Array(2)) as Pairs<
		KeyType,
		ValueType
	>

	while (size--) {
		result[size][0] = keys[size]
		result[size][1] = values[size]
	}

	return result
}

export * as HashMap from "./HashMap/utils.js"
export * as PersistentIndexMap from "./PersistentIndexMap/utils.js"
