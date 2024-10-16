import type { MapClass, Pairs } from "../../../../../dist/src/IndexMap/interfaces.js"
import type { PersistentIndexMap } from "../../../../../dist/src/IndexMap/PersistentIndexMap/interfaces.js"
import type { Pattern } from "../../../../../dist/src/Pattern/interfaces.js"
import {
	baseIndexMapGetIndexTest,
	MapClassTest,
	type MapClassTestSignature
} from "../../lib/classes.js"
import assert from "node:assert"

import { Token } from "../../../../../dist/src/Pattern/Token/classes.js"
import { classTest, signatures } from "lib/lib.js"

import { object } from "@hgargg-0710/one"
const { ownKeys } = object

const persistentIndexMapGetIndexTest = baseIndexMapGetIndexTest<Pattern<number>>(
	Token.value
)

type PersistentIndexMapTestSignature<KeyType = any, ValueType = any> = {
	getIndexTest: Pairs<KeyType, Pattern<number>>
} & MapClassTestSignature<KeyType, ValueType>

export function PersistentIndexMapClassTest<KeyType = any, ValueType = any>(
	className: string,
	mapConstructor: new (pairsList: Pairs<KeyType, ValueType>) => PersistentIndexMap<
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
		signatures(testSignatures, ({ instance, getIndexTest }) => () => {
			const mapInstance = new mapConstructor(instance)
			assert(ownKeys(mapInstance).includes("indexes"))

			// .getIndex
			for (const [key, index] of getIndexTest)
				persistentIndexMapGetIndexTest<KeyType, ValueType>(
					mapInstance,
					key,
					index
				)
		})
	)
}
