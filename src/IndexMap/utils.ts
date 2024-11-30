import type { IndexMap, Pair, Pairs as PairsType } from "./interfaces.js"
import { Pairs } from "./classes.js"

import { typeof as type, boolean } from "@hgargg-0710/one"
import type { TypePredicate } from "../interfaces.js"
const { isArray } = type
const { T } = boolean

export function table<KeyType = any, OutType = any>(
	indexMap: IndexMap<KeyType, OutType>
): [KeyType[], OutType[]] {
	return [indexMap.keys, indexMap.values]
}

export function linearToPairsList<KeyType = any, ValueType = any>(
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

export function keyValuesToPairsList<KeyType = any, ValueType = any>(
	keyValues: [KeyType[], ValueType[]]
): PairsType<KeyType, ValueType> {
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

export function fromPairsList<KeyType = any, ValueType = any>(
	mapPairs: PairsType<KeyType, ValueType>
): [KeyType[], ValueType[]] {
	let size = mapPairs.length
	const [keys, values]: [KeyType[], ValueType[]] = [new Array(size), new Array(size)]
	while (size--) {
		const curr = mapPairs[size]
		keys[size] = curr[0]
		values[size] = curr[1]
	}
	return [keys, values]
}

export const isPair = <KeyType = any, ValueType = any>(
	keyPred?: TypePredicate<KeyType>,
	valuePred?: TypePredicate<ValueType>
) => {
	const [kp, vp] = [keyPred, valuePred].map((x) => x || T)
	return (x: any): x is Pair<KeyType, ValueType> =>
		isArray(x) && x.length === 2 && kp(x[0]) && vp(x[1])
}

export * as HashMap from "./HashMap/utils.js"
export * as PersistentIndexMap from "./PersistentIndexMap/utils.js"
