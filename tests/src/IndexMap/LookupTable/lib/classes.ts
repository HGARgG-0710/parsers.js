import assert from "assert"
import type { FastLookupTable } from "../../../../../dist/src/IndexMap/FastLookupTable/interfaces.js"

import {
	ClassConstructorTest,
	classTest,
	flexibleComparisonMethodTest,
	method,
	setMethodTest,
	signatures
} from "lib/lib.js"

import { isDeletable, isKeyReplaceable, isSettable } from "IndexMap/lib/classes.js"

import { functional, object, type } from "@hgargg-0710/one"
const { and } = functional
const { structCheck } = object
const { isFunction } = type

const fastLookupTablePrototypeProps = [
	"own",
	"byOwned",
	"getIndex",
	"replaceKey",
	"delete",
	"set"
]

export const isFastLookupTable = and(
	structCheck({
		own: isFunction,
		byOwned: isFunction,
		getIndex: isFunction
	}),
	isKeyReplaceable,
	isSettable,
	isDeletable
) as (x: any) => x is FastLookupTable

const FastLookupTableConstructorTest = ClassConstructorTest<FastLookupTable>(
	isFastLookupTable,
	fastLookupTablePrototypeProps
)

const FastLookupTableGetIndexTest =
	flexibleComparisonMethodTest<FastLookupTable>("getIndex")

// * note: this one corresponds to BOTH the '.own' and '.byOwned' testing [as they are only ever used in tandem]
const FastLookupTableOwnByOwnedTest = setMethodTest<FastLookupTable>("own", "byOwned")

function FastLookupTableReplaceKeyTest(
	instance: FastLookupTable,
	keyFrom: any,
	keyTo: any,
	ownedSuccess: any,
	ownedFail: any,
	failKey: any
) {
	method(
		"replaceKey",
		() => {
			const ownedPrior = instance.byOwned(ownedFail)
			instance.replaceKey(keyFrom, keyTo)
			assert.strictEqual(ownedPrior, instance.byOwned(ownedSuccess))
			assert.strictEqual(failKey, instance.byOwned(ownedFail))
		},
		keyFrom,
		keyTo
	)
}

const FastLookupTableSetTest = setMethodTest<FastLookupTable>("set", "getIndex")

function FastLookupTableDeleteTest(instance: FastLookupTable, key: any) {
	method(
		"delete",
		() => {
			instance.delete(key)
			assert.strictEqual(instance.getIndex(key), undefined)
		},
		key
	)
}

type FastLookupTableTestSignature = {
	input: any
	getIndexTests: [any, any, ((x: any, y: any) => boolean)?][]
	setTests: [any, any][]
	byOwnedTests: [any, any, any][]
	replaceKeyTests: [any, any, any, any, any][]
	deleteTests: any[]
}

export function FastLookupTableClassTest(
	className: string,
	tableConstructor: new (...input: any[]) => FastLookupTable,
	testSignatures: FastLookupTableTestSignature[]
) {
	classTest(`(FastLookupTable) ${className}`, () =>
		signatures(
			testSignatures,
			({
					input,
					getIndexTests,
					setTests,
					byOwnedTests,
					replaceKeyTests,
					deleteTests
				}) =>
				() => {
					const instance = FastLookupTableConstructorTest(
						tableConstructor,
						input
					)

					// .getIndex
					for (const [index, value, comparison] of getIndexTests)
						FastLookupTableGetIndexTest(instance, value, [index], comparison)

					// .set
					for (const [key, value] of setTests)
						FastLookupTableSetTest(instance, value, key, value)

					// .own/.byOwned
					for (const [owned, ownershipToken, value] of byOwnedTests)
						FastLookupTableOwnByOwnedTest(
							instance,
							value,
							owned,
							ownershipToken
						)

					// .replaceKey
					for (const [
						keyFrom,
						keyTo,
						ownedSuccess,
						ownedFail,
						failKey
					] of replaceKeyTests)
						FastLookupTableReplaceKeyTest(
							instance,
							keyFrom,
							keyTo,
							ownedSuccess,
							ownedFail,
							failKey
						)

					// .delete
					for (const key of deleteTests)
						FastLookupTableDeleteTest(instance, key)
				}
		)
	)
}
