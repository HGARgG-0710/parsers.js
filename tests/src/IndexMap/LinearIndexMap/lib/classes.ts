import type { MapClass, Pairs } from "../../../../../dist/src/IndexMap/interfaces.js"
import {
	baseIndexMapGetIndexTest,
	isIndexMap,
	MapClassTest,
	type MapClassTestSignature,
	type ReducedMapClassTestSignature
} from "IndexMap/lib/classes.js"

import { function as _f } from "@hgargg-0710/one"
import { classTest, signatures } from "lib/lib.js"
const { id } = _f

const linearMapClassGetIndexTest = baseIndexMapGetIndexTest<number>(id)

type LinearMapClassTestSignature<KeyType = any, ValueType = any> = {
	getIndexTest: Pairs<any, number>
} & MapClassTestSignature<KeyType, ValueType>

export type ReducedLinearMapClassTestSignature<KeyType = any, ValueType = any> = {
	getIndexTest: Pairs<any, number>
} & ReducedMapClassTestSignature<KeyType, ValueType>

export function LinearMapClassTest<KeyType = any, ValueType = any>(
	className: string,
	mapConstructor: MapClass<KeyType, ValueType>,
	testSignatures: LinearMapClassTestSignature<KeyType, ValueType>[]
) {
	MapClassTest<KeyType, ValueType>(className, mapConstructor, testSignatures)
	classTest(`(LinearIndexMap) ${className}`, () =>
		signatures(testSignatures, ({ instance, getIndexTest }) => () => {
			const mapInstance = isIndexMap(instance)
				? instance
				: new mapConstructor(instance)

			// .getIndex
			for (const [key, index] of getIndexTest)
				linearMapClassGetIndexTest(mapInstance, key, index)
		})
	)
}
