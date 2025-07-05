import { array } from "@hgargg-0710/one"
import assert from "assert"
import { Pairs } from "../../../../dist/src/samples.js"

export function toArrayTest<V = any>(
	pairs: array.Pairs<number, V>,
	sameAs: (V | undefined)[]
) {
	assert(array.same(sameAs, Pairs.toArray(pairs)))
}
