import assert from "node:assert"

import type {
	IIndexMap,
	IMapClass
} from "../../../../../dist/src/IndexMap/interfaces.js"

import type { IPersistentIndexMap } from "../../../../../dist/src/IndexMap/PersistentIndexMap/interfaces.js"

import type {
	IPattern,
	IPointer
} from "../../../../../dist/src/Pattern/interfaces.js"

import {
	baseIndexMapGetIndexTest,
	ChainIndexMapTest,
	MapClassTest,
	type MapClassTestSignature
} from "../../lib/classes.js"

import { value } from "../../../../../dist/src/Pattern/utils.js"
import { classTest, property, signatures } from "lib/lib.js"

import { object, array } from "@hgargg-0710/one"
const { ownKeys } = object
const { same } = array

const valueCompare = (a: any, b: any) => value(a) === value(b)

const persistentIndexMapGetIndexTest = baseIndexMapGetIndexTest<
	IPointer<number>
>(value<number> as (x: IPointer<number>) => number)

export function persistentIndexMapIndexesTest(
	arr1: IPattern<number>[],
	arr2: IPattern<number>[]
) {
	property("indexes", () => assert(same(arr1, arr2, valueCompare)))
}

type PersistentIndexMapTestSignature<KeyType = any, ValueType = any> = {
	getIndexTest: [KeyType, IPointer<number>, IPointer<IPointer<number>>][]
	indexesTest: IPointer<number>[]
} & MapClassTestSignature<KeyType, ValueType>

export function PersistentIndexMapClassTest<KeyType = any, ValueType = any>(
	className: string,
	mapConstructor: new (
		pairsList: IIndexMap<KeyType, ValueType>
	) => IPersistentIndexMap<KeyType, ValueType>,
	testSignatures: PersistentIndexMapTestSignature[]
) {
	MapClassTest(
		className,
		mapConstructor as unknown as IMapClass<KeyType, ValueType>,
		testSignatures
	)

	classTest(`(PersistentIndexMap) ${className}`, () =>
		signatures(
			testSignatures,
			({ instance, getIndexTest, indexesTest, ...signature }) =>
				() => {
					const mapInstance = new mapConstructor(
						instance as IIndexMap<KeyType, ValueType>
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
					persistentIndexMapIndexesTest(
						mapInstance.indexes,
						indexesTest
					)
				}
		)
	)
}
