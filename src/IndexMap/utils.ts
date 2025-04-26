import type { array } from "@hgargg-0710/one"
import { Pairs } from "./classes.js"
import type { IIndexMap } from "./interfaces.js"

/**
 * Returns the pair of `indexMap.keys` and `indexMap.values`
 */
export function table<KeyType = any, OutType = any>(
	indexMap: IIndexMap<KeyType, OutType, any, any>
): [KeyType[], OutType[]] {
	return [indexMap.keys, indexMap.values]
}

/**
 * Given an array of linearized pairs `KeyType, ValueType`, returns the equivalent array of pairs
 */
export function linearPairs<KeyType = any, ValueType = any>(
	linear: (KeyType | ValueType)[]
) {
	let size = (linear.length >> 1) + (linear.length % 2)
	const result = Pairs<KeyType, ValueType>(size)

	while (--size) {
		const curr = result[size]
		const index = size << 1
		curr[0] = linear[index] as KeyType
		curr[1] = linear[index + 1] as ValueType
	}

	return result
}

/**
 * Given a pair of arrays of keys and values, returns an array of pairs.
 */
export function toPairs<KeyType = any, ValueType = any>(
	keyValues: [KeyType[], ValueType[]]
) {
	const [keys, values] = keyValues
	let size = keys.length

	const result = Pairs<KeyType, ValueType>(size)

	while (size--) {
		const curr = result[size]
		curr[0] = keys[size]
		curr[1] = values[size]
	}

	return result
}

/**
 * Returns a pair of keys and values, based off an array of pairs
 */
export function fromPairs<KeyType = any, ValueType = any>(
	mapPairs: array.Pairs<KeyType, ValueType>
): [KeyType[], ValueType[]] {
	let size = mapPairs.length
	const [keys, values]: [KeyType[], ValueType[]] = [
		new Array(size),
		new Array(size)
	]

	while (size--) {
		const [key, value] = mapPairs[size]
		keys[size] = key
		values[size] = value
	}

	return [keys, values]
}

export * as PersistentIndexMap from "./PersistentIndexMap/utils.js"
