import type { IMapClass } from "../../../../../dist/src/IndexMap/interfaces.js"

import {
	baseIndexMapGetIndexTest,
	isIndexMap,
	MapClassTest,
	type MapClassTestSignature,
	type ReducedMapClassTestSignature
} from "IndexMap/lib/classes.js"

import { classTest, signatures } from "lib/lib.js"

import { functional, array } from "@hgargg-0710/one"
const { id } = functional

const linearMapClassGetIndexTest = baseIndexMapGetIndexTest<number>(id)

type LinearMapClassTestSignature<KeyType = any, ValueType = any> = {
	getIndexTest: array.Pairs<any, number>
} & MapClassTestSignature<KeyType, ValueType>

export type ReducedLinearMapClassTestSignature<
	KeyType = any,
	ValueType = any
> = {
	getIndexTest: array.Pairs<any, number>
} & ReducedMapClassTestSignature<KeyType, ValueType>

export function LinearMapClassTest<KeyType = any, ValueType = any>(
	className: string,
	mapConstructor: IMapClass<KeyType, ValueType>,
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
