import assert from "assert"

import type { ILookupTable } from "../../../../../dist/src/IndexMap/LookupTable/interfaces.js"

import {
	ClassConstructorTest,
	classTest,
	flexibleComparisonMethodTest,
	method,
	setMethodTest,
	signatures
} from "lib/lib.js"

import {
	isDeletable,
	isKeyReplaceable,
	isSettable
} from "IndexMap/lib/classes.js"

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

export const isLookupTable = and(
	structCheck({
		own: isFunction,
		byOwned: isFunction,
		getIndex: isFunction
	}),
	isKeyReplaceable,
	isSettable,
	isDeletable
) as (x: any) => x is ILookupTable

const LookupTableConstructorTest = ClassConstructorTest<ILookupTable>(
	isLookupTable,
	fastLookupTablePrototypeProps
)

const LookupTableGetIndexTest =
	flexibleComparisonMethodTest<ILookupTable>("getIndex")

// * note: this one corresponds to BOTH the '.own' and '.byOwned' testing [as they are only ever used in tandem]
const LookupTableOwnByOwnedTest = setMethodTest<ILookupTable>(
	"own",
	"byOwned"
)

function FastLookupTableReplaceKeyTest(
	instance: ILookupTable,
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
			instance.rekey(keyFrom, keyTo)
			assert.strictEqual(ownedPrior, instance.byOwned(ownedSuccess))
			assert.strictEqual(failKey, instance.byOwned(ownedFail))
		},
		keyFrom,
		keyTo
	)
}

const FastLookupTableSetTest = setMethodTest<ILookupTable>("set", "getIndex")

function FastLookupTableDeleteTest(instance: ILookupTable, key: any) {
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

export function LookupTableClassTest(
	className: string,
	tableConstructor: new (...input: any[]) => ILookupTable,
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
					const instance = LookupTableConstructorTest(
						tableConstructor,
						input
					)

					// .getIndex
					for (const [index, value, comparison] of getIndexTests)
						LookupTableGetIndexTest(
							instance,
							value,
							[index],
							comparison
						)

					// .set
					for (const [key, value] of setTests)
						FastLookupTableSetTest(instance, value, key, value)

					// .own/.byOwned
					for (const [owned, ownershipToken, value] of byOwnedTests)
						LookupTableOwnByOwnedTest(
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
