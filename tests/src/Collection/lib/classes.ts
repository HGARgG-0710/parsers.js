import type { ICollection } from "../../../../dist/src/Collection/interfaces.js"
import {
	ClassConstructorTest,
	classTest,
	FunctionalClassConctructorTest,
	iterationTest,
	PropertyMethodTest,
	signatures
} from "lib/lib.js"

import { object, boolean, type } from "@hgargg-0710/one"
const { structCheck } = object
const { T } = boolean
const { isFunction } = type

const isCollection = structCheck<ICollection>({
	value: T,
	push: isFunction,
	[Symbol.iterator]: isFunction
})

const collectionPrototypeProps = ["push", Symbol.iterator]
const collectionOwnProps = ["value"]

const CollectionConstructorTest = ClassConstructorTest<ICollection>(
	isCollection,
	collectionPrototypeProps,
	collectionOwnProps
)

const CollectionFunctionalConstructorTest = FunctionalClassConctructorTest(
	isCollection,
	collectionPrototypeProps,
	collectionOwnProps
)

export const CollectionPushTest =
	PropertyMethodTest("value")<ICollection>("push")
	
const CollectionIterationTest = iterationTest<ICollection>

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
	collectionConstructor:
		| (new (x: any) => ICollection)
		| ((x: any) => ICollection),
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
								collectionConstructor as (
									x: any
								) => ICollection,
								input
						  )
						: CollectionConstructorTest(
								collectionConstructor as new (
									x: any
								) => ICollection,
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
