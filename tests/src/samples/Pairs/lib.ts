import { array } from "@hgargg-0710/one"
import assert from "assert"
import { Pairs } from "../../../../dist/src/samples.js"

export enum TestTypes {
	NUM_ARG = 0,
	PAIRS_ARG = 1
}

export function PairsTestNumber(n: number) {
	const pairs = Pairs(n)
	assert(
		array.recursiveSame(
			array.numbers(n).map(() => new Array(2)),
			pairs
		)
	)
}

export function PairsTest<K = any, V = any>(pairs: array.Pairs<K, V>) {
	assert(array.recursiveSame(pairs, Pairs(...pairs)))
}

export function fromLinearTest<K = any, V = any>(
	linear: Iterable<K | V>,
	expected: array.Pairs<K, V | undefined>
) {
	assert(array.recursiveSame(expected, Pairs.fromLinear(linear)))
}

export function toTest<K = any, V = any>(
	keys: Iterable<K>,
	values: Iterable<V>,
	expected: array.Pairs<K, V>
) {
	assert(array.recursiveSame(Pairs.to(keys, values), expected))
}

export function fromTest<K = any, V = any>(
	mapPairs: Iterable<[K, V]>,
	expected: [K[], V[]]
) {
	assert(array.recursiveSame(Pairs.from(mapPairs), expected))
}

export function toArrayTest<V = any>(
	pairs: array.Pairs<number, V>,
	sameAs: (V | undefined)[]
) {
	assert(array.same(sameAs, Pairs.toArray(pairs)))
}

export function iteratorCheck<K = any, V = any>(
	tested: Iterable<[K, V]>,
	sameAs: array.Pairs<K, V>
) {
	let i = 0
	for (const [key, value] of tested) {
		const [eKey, eValue] = sameAs[i++]
		assert.strictEqual(key, eKey)
		assert.strictEqual(value, eValue)
	}
}
