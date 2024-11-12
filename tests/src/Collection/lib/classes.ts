import type { Collection } from "../../../../dist/src/Collection/interfaces.js"
import {
	ClassConstructorTest,
	classTest,
	FunctionalClassConctructorTest,
	iterationTest,
	PatternMethodTest,
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

const collectionPrototypeProps = ["push", Symbol.iterator]
const collectionOwnProps = ["value"]

const CollectionConstructorTest = ClassConstructorTest<Collection>(
	isCollection,
	collectionPrototypeProps,
	collectionOwnProps
)
const CollectionFunctionalConstructorTest = FunctionalClassConctructorTest(
	isCollection,
	collectionPrototypeProps,
	collectionOwnProps
)
export const CollectionPushTest = PatternMethodTest<Collection>("push")
const CollectionIterationTest = iterationTest<Collection>

export type CollectionClassTestSignature = {
	input: any
	pushed: any[]
	expectedPushValue: any
	pushCompare: (x: any, y: any) => boolean
	iteratedOver: any[]
	iterationCompare?: (x: any, y: any) => boolean
}

export function CollectionClassTest(
	className: string,
	collectionConstructor: (new (x: any) => Collection) | ((x: any) => Collection),
	testSignatures: CollectionClassTestSignature[],
	functionalConstructor: boolean = false
) {
	classTest(`(Collection) ${className}`, () =>
		signatures(
			testSignatures,
			({
					input,
					pushed,
					expectedPushValue,
					pushCompare,
					iteratedOver,
					iterationCompare
				}) =>
				() => {
					const collectionInstance = functionalConstructor
						? CollectionFunctionalConstructorTest(
								collectionConstructor as (x: any) => Collection,
								input
						  )
						: CollectionConstructorTest(
								collectionConstructor as new (x: any) => Collection,
								input
						  )

					// [Symbol.iterator]
					CollectionIterationTest(
						collectionInstance,
						iteratedOver,
						iterationCompare
					)

					// .push
					CollectionPushTest(
						collectionInstance,
						expectedPushValue,
						pushed,
						pushCompare
					)
				}
		)
	)
}
