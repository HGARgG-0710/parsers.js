import assert from "node:assert"

import type {
	IIndexMap,
	IMapClass
} from "../../../../../dist/src/IndexMap/interfaces.js"

import type { IPersistentIndexMap } from "../../../../../dist/src/IndexMap/PersistentIndexMap/interfaces.js"

import type { IPointer } from "../../../../../dist/src/Pattern/interfaces.js"

import {
	baseIndexMapGetIndexTest,
	ChainIndexMapTest,
	MapClassTest,
	type MapClassTestSignature
} from "../../lib/classes.js"

import { value } from "../../../../../dist/src/Pattern/utils.js"
import { classTest, signatures } from "lib/lib.js"

import { object, array } from "@hgargg-0710/one"
const { ownKeys } = object

const persistentIndexMapGetIndexTest = baseIndexMapGetIndexTest<
	IPointer<number>
>(value<number> as (x: IPointer<number>) => number)

type PersistentIndexMapTestSignature<KeyType = any, ValueType = any> = {
	getIndexTest: [KeyType, IPointer<number>, IPointer<IPointer<number>>][]
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
			({ instance, getIndexTest, ...signature }) =>
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
				}
		)
	)
}
