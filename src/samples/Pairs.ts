import { array, type } from "@hgargg-0710/one"

const { isNumber } = type

export function Pairs<K = any, V = any>(
	...pairs: array.Pairs<K, V> | [number]
) {
	const n = pairs[0]
	return (
		isNumber(n) ? Array.from({ length: n }, () => new Array(2)) : pairs
	) as array.Pairs<K, V>
}

export namespace Pairs {
	/**
	 * Given an array of linearized pairs `KeyType, ValueType`, returns the equivalent array of pairs
	 */
	export function fromLinear<K = any, V = any>(linear: Iterable<K | V>) {
		const result = Pairs<K, V>()

		let i = 0
		for (const x of linear) {
			const mod = i % 2
			const pair = Math.floor(i / 2)
			++i
			if (mod === 0) result.push([x as K, null] as array.Pair<K, V>)
			else result[pair][mod] = x
		}

		return result
	}

	/**
	 * Given a pair of arrays of keys and values, returns an array of pairs.
	 */
	export function to<K = any, V = any>(
		keys: Iterable<K>,
		values: Iterable<V>
	) {
		const result = Pairs<K, V>()
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
	export function from<K = any, V = any>(
		mapPairs: Iterable<[K, V]>
	): [K[], V[]] {
		const keys: K[] = []
		const values: V[] = []

		for (const [key, value] of mapPairs) {
			keys.push(key)
			values.push(value)
		}

		return [keys, values]
	}
}
