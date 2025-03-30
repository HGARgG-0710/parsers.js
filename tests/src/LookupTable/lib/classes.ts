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
const { isFunction, isNullary } = type

const lookupTablePrototypeProps = [
	"own",
	"byOwned",
	"replaceKey",
	"delete",
	"set"
]

function handleUnowned(instance: ILookupTable, item: any) {
	if (instance.isOwned(item))
		throw new Error("Expected an unowned item to be passed")
}

export const isLookupTable = and(
	structCheck({
		own: isFunction,
		byOwned: isFunction
	}),
	isKeyReplaceable,
	isSettable,
	isDeletable
) as (x: any) => x is ILookupTable

const LookupTableConstructorTest = ClassConstructorTest<ILookupTable>(
	isLookupTable,
	lookupTablePrototypeProps
)

// * note: this one corresponds to BOTH the '.own' and '.byOwned' testing [as they are only ever used in tandem]
const LookupTableOwnByOwnedTest = setMethodTest<ILookupTable>("own", "byOwned")

function LookupTableReplaceKeyTest(
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

function LookupTableDeleteTest(instance: ILookupTable, key: any, item: any) {
	method(
		"delete",
		() => {
			handleUnowned(instance, item)

			const copy = instance.copy()
			assert(!isNullary(copy.claim(item)))

			instance.delete(key)
			assert.strictEqual(instance.claim(item), null)
			assert(copy.isOwned(item))
		},
		key
	)
}

type FastLookupTableTestSignature = {
	input: any
	setTests: [any, any][]
	byOwnedTests: [any, any, any][]
	replaceKeyTests: [any, any, any, any, any][]
	deleteTests: [any, any][]
}

export function LookupTableClassTest(
	className: string,
	tableConstructor: new (...input: any[]) => ILookupTable,
	testSignatures: FastLookupTableTestSignature[]
) {
	classTest(`(FastLookupTable) ${className}`, () =>
		signatures(
			testSignatures,
			({ input, byOwnedTests, replaceKeyTests, deleteTests }) =>
				() => {
					const instance = LookupTableConstructorTest(
						tableConstructor,
						input
					)

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
						LookupTableReplaceKeyTest(
							instance,
							keyFrom,
							keyTo,
							ownedSuccess,
							ownedFail,
							failKey
						)

					// .delete
					for (const [key, item] of deleteTests)
						LookupTableDeleteTest(instance, key, item)
				}
		)
	)
}
