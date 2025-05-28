import { array, type } from "@hgargg-0710/one"

const { isNumber } = type

export function Pairs<KeyType = any, ValueType = any>(
	...pairs: array.Pairs<KeyType, ValueType> | [number]
) {
	const n = pairs[0]
	return (
		isNumber(n) ? Array.from({ length: n }, () => new Array(2)) : pairs
	) as array.Pairs<KeyType, ValueType>
}

export namespace Pairs {
	/**
	 * Given an array of linearized pairs `KeyType, ValueType`, returns the equivalent array of pairs
	 */
	export function fromLinear<KeyType = any, ValueType = any>(
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
	export function to<KeyType = any, ValueType = any>(
		keys: KeyType[],
		values: ValueType[]
	) {
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
	export function from<KeyType = any, ValueType = any>(
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
}
