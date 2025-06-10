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
		linear: Iterable<KeyType | ValueType>
	) {
		const result = Pairs<KeyType, ValueType>()

		let i = 0
		for (const x of linear) {
			const mod = i % 2
			const pair = Math.floor(i / 2)
			++i
			if (mod === 0)
				result.push([x as KeyType, null] as array.Pair<
					KeyType,
					ValueType
				>)
			else result[pair][mod] = x
		}

		return result
	}

	/**
	 * Given a pair of arrays of keys and values, returns an array of pairs.
	 */
	export function to<KeyType = any, ValueType = any>(
		keys: Iterable<KeyType>,
		values: Iterable<ValueType>
	) {
		const result = Pairs<KeyType, ValueType>()
		const valueIterator = values[Symbol.iterator]()

		for (const currKey of keys) {
			const currValue = valueIterator.next().value
			result.push([currKey, currValue])
		}

		return result
	}

	/**
	 * Returns a pair of keys and values, based off an array of pairs
	 */
	export function from<KeyType = any, ValueType = any>(
		mapPairs: Iterable<[KeyType, ValueType]>
	): [KeyType[], ValueType[]] {
		const keys: KeyType[] = []
		const values: ValueType[] = []

		for (const [key, value] of mapPairs) {
			keys.push(key)
			values.push(value)
		}

		return [keys, values]
	}
}
