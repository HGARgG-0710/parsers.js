import type { MapClass, Pairs } from "../../../../../dist/src/IndexMap/interfaces.js"
import {
	baseIndexMapGetIndexTest,
	MapClassTest,
	type MapClassTestSignature
} from "IndexMap/lib/classes.js"

import { function as _f } from "@hgargg-0710/one"
import { classTest, signatures } from "lib/lib.js"
const { id } = _f

const linearMapClassGetIndexTest = baseIndexMapGetIndexTest<number>(id)

type LinearMapClassTestSignature<KeyType = any, ValueType = any> = {
	getIndexTest: Pairs<any, number>
} & MapClassTestSignature<KeyType, ValueType>

export function LinearMapClassTest<KeyType = any, ValueType = any>(
	className: string,
	mapConstructor: MapClass<KeyType, ValueType>,
	testSignatures: LinearMapClassTestSignature<KeyType, ValueType>[]
) {
	MapClassTest<KeyType, ValueType>(className, mapConstructor, testSignatures)
	classTest(`(LinearIndexMap) ${className}`, () =>
		signatures(testSignatures, ({ instance, getIndexTest }) => () => {
			// .getIndex
			for (const [key, index] of getIndexTest)
				linearMapClassGetIndexTest(new mapConstructor(instance), key, index)
		})
	)
}
