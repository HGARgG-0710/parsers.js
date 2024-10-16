import assert from "assert"
import type { FastLookupTable } from "../../../../../dist/src/IndexMap/FastLookupTable/interfaces.js"
import {
	ClassConstructorTest,
	classTest,
	method,
	methodTest,
	setMethodTest,
	signatures
} from "lib/lib.js"
import { isDeletable, isKeyReplaceable, isSettable } from "IndexMap/lib/classes.js"

import { function as _f, object, typeof as type } from "@hgargg-0710/one"
const { and } = _f
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

const FastLookupTableGetIndexTest = methodTest<FastLookupTable>("getIndex")

// * note: this one corresponds to BOTH the '.own' and '.byOwned' testing [as they are only ever used in tandem]
const FastLookupTableOwnByOwnedTest = setMethodTest<FastLookupTable>("own", "byOwned")

function FastLookupTableReplaceKeyTest(
	instance: FastLookupTable,
	keyFrom: any,
	keyTo: any,
	failKey: any
) {
	method(
		"replaceKey",
		() => {
			const index = instance.getIndex(keyFrom)
			instance.replaceKey(keyFrom, keyTo)
			assert.strictEqual(index, instance.getIndex(keyTo))
			assert.strictEqual(failKey, instance.getIndex(keyFrom))
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
	sub: any
	getIndexTests: [any, any][]
	setTests: [any, any][]
	ownTests: [any, any, any][]
	replaceKeyTests: [any, any, any][]
	deleteTests: any[]
}

export function FastLookupTableTest(
	className: string,
	tableConstructor: new (...input: any[]) => FastLookupTable,
	testSignatures: FastLookupTableTestSignature[]
) {
	classTest(`(FastLookupTable) ${className}`, () =>
		signatures(
			testSignatures,
			({ sub, getIndexTests, setTests, ownTests, replaceKeyTests, deleteTests }) =>
				() => {
					const instance = FastLookupTableConstructorTest(tableConstructor, sub)

					// .getIndex
					for (const [index, value] of getIndexTests)
						FastLookupTableGetIndexTest(instance, value, index)

					// .set
					for (const [key, value] of setTests)
						FastLookupTableSetTest(instance, value, key, value)

					// .own/.byOwned
					for (const [owned, ownershipToken, value] of ownTests)
						FastLookupTableOwnByOwnedTest(
							instance,
							value,
							owned,
							ownershipToken
						)

					// .replaceKey
					for (const [keyFrom, keyTo, failKey] of replaceKeyTests)
						FastLookupTableReplaceKeyTest(instance, keyFrom, keyTo, failKey)

					// .delete
					for (const key of deleteTests)
						FastLookupTableDeleteTest(instance, key)
				}
		)
	)
}
