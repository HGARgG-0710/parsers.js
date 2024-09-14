import { describe } from "node:test"

import type { Collection } from "../../../../../dist/src/Pattern/Collection/interfaces.js"
import { isCollection } from "../../../../../dist/src/Pattern/Collection/utils.js"
import { ambigiousMethodTest, ClassConstructorTest, iterationTest } from "lib/lib.js"

const CollectionConstructorTest = ClassConstructorTest<Collection>(isCollection)
const CollectionPushTest = ambigiousMethodTest<Collection>("push")
const CollectionIterationTest = iterationTest<Collection>

type CollectionClassTestSignature = {
	input: any
	pushed: any[]
	expectedPushValue: any
	pushCompare: (x: any, y: any) => boolean
	iteratedOver: any[]
}

export function CollectionClassTest(
	className: string,
	collectionConstructor: (x: any) => Collection,
	instances: CollectionClassTestSignature[]
) {
	describe(`class: (Collection) ${className}`, () => {
		for (const instance of instances) {
			const {
				input,
				pushed,
				expectedPushValue: expectedValue,
				pushCompare: compare,
				iteratedOver
			} = instance

			const collectionInstance = CollectionConstructorTest(
				collectionConstructor,
				input
			)

			CollectionIterationTest(collectionInstance, iteratedOver) // 				[Symbol.iterator]
			CollectionPushTest(collectionInstance, pushed, expectedValue, compare) //	.push
		}
	})
}
