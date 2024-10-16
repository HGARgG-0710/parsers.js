import type { Collection } from "../../../../../dist/src/Pattern/Collection/interfaces.js"
import {
	ClassConstructorTest,
	classTest,
	iterationTest,
	methodTest,
	signatures
} from "lib/lib.js"

import { object, boolean, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { T } = boolean
const { isFunction } = type

const isCollection = structCheck<Collection>({
	value: T,
	push: isFunction,
	[Symbol.iterator]: isFunction
})

const CollectionConstructorTest = ClassConstructorTest<Collection>(
	isCollection,
	["push", Symbol.iterator],
	["value"]
)
const CollectionPushTest = methodTest<Collection>("push")
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
	collectionConstructor: new (x: any) => Collection,
	testSignatures: CollectionClassTestSignature[]
) {
	classTest(`(Collection) ${className}`, () =>
		signatures(
			testSignatures,
			({
					input,
					pushed,
					expectedPushValue: expectedValue,
					pushCompare,
					iteratedOver
				}) =>
				() => {
					const collectionInstance = CollectionConstructorTest(
						collectionConstructor,
						input
					)

					// [Symbol.iterator]
					CollectionIterationTest(collectionInstance, iteratedOver)

					// .push
					CollectionPushTest(
						collectionInstance,
						expectedValue,
						pushCompare,
						pushed
					)
				}
		)
	)
}
