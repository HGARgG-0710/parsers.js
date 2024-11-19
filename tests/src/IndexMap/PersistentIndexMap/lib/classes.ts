import assert from "node:assert"

import type { IndexMap, MapClass } from "../../../../../dist/src/IndexMap/interfaces.js"
import type { PersistentIndexMap } from "../../../../../dist/src/IndexMap/PersistentIndexMap/interfaces.js"
import type { Pattern } from "../../../../../dist/src/Pattern/interfaces.js"
import {
	baseIndexMapGetIndexTest,
	ChainIndexMapTest,
	MapClassTest,
	type MapClassTestSignature
} from "../../lib/classes.js"

import { value } from "../../../../../dist/src/Pattern/utils.js"
import { arraysSame, classTest, property, signatures } from "lib/lib.js"

import { object } from "@hgargg-0710/one"
const { ownKeys } = object

const persistentIndexMapGetIndexTest = baseIndexMapGetIndexTest<Pattern<number>>(value)

export function persistentIndexMapIndexesTest(arr1: Pattern<number>[], arr2: Pattern<number>[]) {
	property("indexes", () => assert(arraysSame(arr1, arr2, value)))
}

type PersistentIndexMapTestSignature<KeyType = any, ValueType = any> = {
	getIndexTest: [KeyType, Pattern<number>, Pattern<Pattern<number>>][]
	indexesTest: Pattern<number>[]
} & MapClassTestSignature<KeyType, ValueType>

export function PersistentIndexMapClassTest<KeyType = any, ValueType = any>(
	className: string,
	mapConstructor: new (pairsList: IndexMap<KeyType, ValueType>) => PersistentIndexMap<
		KeyType,
		ValueType
	>,
	testSignatures: PersistentIndexMapTestSignature[]
) {
	MapClassTest(
		className,
		mapConstructor as unknown as MapClass<KeyType, ValueType>,
		testSignatures
	)

	classTest(`(PersistentIndexMap) ${className}`, () =>
		signatures(
			testSignatures,
			({ instance, getIndexTest, indexesTest, ...signature }) =>
				() => {
					const mapInstance = new mapConstructor(
						instance as IndexMap<KeyType, ValueType>
					)
					assert(ownKeys(mapInstance).includes("indexes"))

					// .getIndex
					for (const [key, index, safe] of getIndexTest)
						persistentIndexMapGetIndexTest<KeyType, ValueType>(
							mapInstance,
							key,
							index,
							safe
						)

					ChainIndexMapTest(mapInstance, signature)

					// Checking the operations for correctness
					persistentIndexMapIndexesTest(mapInstance.indexes, indexesTest)
				}
		)
	)
}
