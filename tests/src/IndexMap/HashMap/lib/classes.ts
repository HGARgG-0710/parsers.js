import assert from "assert"

import type { IHashMap } from "../../../../../dist/src/IndexMap/HashMap/interfaces.js"
import type { IInternalHash } from "../../../../../dist/src/IndexMap/HashMap/InternalHash/interfaces.js"

import {
	isDeletable,
	isIndexable,
	isKeyReplaceable,
	isSettable,
	isSizeable
} from "IndexMap/lib/classes.js"

import {
	ClassConstructorTest,
	classTest,
	method,
	methodTest,
	setMethodTest,
	signatures
} from "lib/lib.js"

import { isInternalHash } from "IndexMap/InternalHash/lib/classes.js"

import { object, type, functional } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type
const { and } = functional

const isHashMap = and(
	structCheck({
		hash: isFunction,
		value: isInternalHash
	}),
	isSettable,
	isIndexable,
	isKeyReplaceable,
	isDeletable,
	isSizeable
) as (x: any) => x is IHashMap

const HashMapConstructorTest = ClassConstructorTest<IHashMap>(
	isHashMap,
	["index", "set", "delete", "replaceKey", "hash"],
	["value"]
)

const HashMapIndexTest = methodTest<IHashMap>("index")
const HashMapSetTest = setMethodTest<IHashMap>("set", "index")

function HashMapDeleteTest(instance: IHashMap, key: any) {
	method(
		"delete",
		() => {
			instance.delete(key)
			assert.strictEqual(instance.index(key), instance.value.default)
		},
		key
	)
}

function HashMapReplaceKeyTest(instance: IHashMap, keyFrom: any, keyTo: any) {
	method(
		"replaceKey",
		() => {
			const value = instance.index(keyFrom)
			instance.rekey(keyFrom, keyTo)
			assert.strictEqual(instance.index(keyTo), value)
			assert.strictEqual(instance.index(keyFrom), instance.value.default)
		},
		keyFrom,
		keyTo
	)
}

type HashMapTestSignature = {
	input: IInternalHash
	indexTests: [any, any][]
	setTests: [any, any][]
	deleteTests: any[]
	replaceKeyTests: [any, any][]
}

export function HashMapClassTest(
	className: string,
	HashMapClass: new (structure: IInternalHash) => IHashMap,
	testSignatures: HashMapTestSignature[]
) {
	classTest(`(HashMap) ${className}`, () =>
		signatures(
			testSignatures,
			({ input, indexTests, setTests, deleteTests, replaceKeyTests }) =>
				() => {
					const instance = HashMapConstructorTest(HashMapClass, input)

					// .index
					for (const [key, value] of indexTests)
						HashMapIndexTest(instance, value, key)

					// .set
					for (const [key, value] of setTests)
						HashMapSetTest(instance, value, key, value)

					// .delete
					for (const key of deleteTests)
						HashMapDeleteTest(instance, key)

					// .replaceKey
					for (const [keyFrom, keyTo] of replaceKeyTests)
						HashMapReplaceKeyTest(instance, keyFrom, keyTo)
				}
		)
	)
}
