import {
	baseIndexMapGetIndexTest,
	MapClassTest,
	type MapClassTestSignature
} from "IndexMap/lib/classes.js"
import type { MapClass, Pairs } from "../../../../../dist/src/IndexMap/interfaces.js"

import { function as _f } from "@hgargg-0710/one"
import { describe } from "node:test"
const { id } = _f

const linearMapClassGetIndexTest = baseIndexMapGetIndexTest<number>(id)

type LinearMapClassTestSignature<KeyType = any, ValueType = any> = {
	getIndexTest: Pairs<KeyType, number>
} & MapClassTestSignature<KeyType, ValueType>

export function LinearMapClassTest<KeyType = any, ValueType = any>(
	className: string,
	mapConstructor: MapClass<KeyType, ValueType>,
	signatures: LinearMapClassTestSignature<KeyType, ValueType>[]
) {
	MapClassTest<KeyType, ValueType>(className, mapConstructor, signatures)
	describe(`class: (LinearIndexMap) ${className}`, () => {
		for (const signature of signatures) {
			const { instance, getIndexTest } = signature
			const linearMapInstance = new mapConstructor(instance)
			linearMapClassGetIndexTest(linearMapInstance, getIndexTest) // .getIndex
		}
	})
}
