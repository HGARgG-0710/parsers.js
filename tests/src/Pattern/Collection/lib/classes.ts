import { describe } from "node:test"

import type { Collection } from "../../../../../dist/src/Pattern/Collection/interfaces.js"
import { ambigiousMethodTest, ClassConstructorTest, iterationTest } from "lib/lib.js"

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
	collectionConstructor: new (x: any) => Collection,
	instances: CollectionClassTestSignature[]
) {
	describe(`class: (Collection) ${className}`, () => {
		for (const instance of instances) {
			const {
				input,
				pushed,
				expectedPushValue: expectedValue,
				pushCompare,
				iteratedOver
			} = instance

			const collectionInstance = CollectionConstructorTest(
				collectionConstructor,
				input
			)

			CollectionIterationTest(collectionInstance, iteratedOver) // 				[Symbol.iterator]
			CollectionPushTest(collectionInstance, expectedValue, pushCompare, pushed) //	.push
		}
	})
}
