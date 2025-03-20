import assert from "assert"

import type { IInternalHash } from "../../../../../dist/src/IndexMap/HashMap/InternalHash/interfaces.js"

import {
	ClassConstructorTest,
	classTest,
	method,
	methodTest,
	setMethodTest,
	signatures
} from "lib/lib.js"

import {
	isDeletable,
	isKeyReplaceable,
	isSettable
} from "IndexMap/lib/classes.js"

import { object, functional, type } from "@hgargg-0710/one"
const { structCheck } = object
const { and } = functional
const { isFunction, isObject } = type

export const isInternalHash = and(
	structCheck({
		sub: isObject,
		get: isFunction
	}),
	isSettable,
	isDeletable,
	isKeyReplaceable
) as (x: any) => x is IInternalHash

const InternalHashConstructorTest = ClassConstructorTest<IInternalHash>(
	isInternalHash,
	["set", "delete", "replaceKey", "get"],
	["value"]
)

const InternalHashSetTest = setMethodTest<IInternalHash>("set", "get")
const InternalHashGetTest = methodTest<IInternalHash>("get")

function InternalHashDeleteTest(instance: IInternalHash, key: any) {
	method(
		"delete",
		() => {
			instance.delete(key)
			assert.strictEqual(instance.get(key), instance.default)
		},
		key
	)
}

function InternalHashReplaceKeyTest(
	instance: IInternalHash,
	keyFrom: any,
	keyTo: any
) {
	method(
		"replaceKey",
		() => {
			const value = instance.get(keyFrom)
			instance.rekey(keyFrom, keyTo)
			assert.strictEqual(value, instance.get(keyTo))
			assert.strictEqual(instance.default, instance.get(keyFrom))
		},
		keyFrom,
		keyTo
	)
}

type InternalHashTestSignature = {
	input: [any, any?]
	getTests: [any, any][]
	setTests: [any, any][]
	deleteTests: any[]
	replaceKeyTests: [any, any][]
}

export function InternalHashTest(
	className: string,
	hashConstructor: new (...x: any[]) => IInternalHash,
	testSignatures: InternalHashTestSignature[]
) {
	classTest(`(InternalHash) ${className}`, () =>
		signatures(
			testSignatures,
			({ input, getTests, setTests, deleteTests, replaceKeyTests }) =>
				() => {
					const instance = InternalHashConstructorTest(
						hashConstructor,
						input
					)

					// .get
					for (const [key, value] of getTests)
						InternalHashGetTest(instance, value, key)

					// .set
					for (const [key, value] of setTests)
						InternalHashSetTest(instance, value, key, value)

					// .delete
					for (const key of deleteTests)
						InternalHashDeleteTest(instance, key)

					// .replaceKey
					for (const [keyFrom, keyTo] of replaceKeyTests)
						InternalHashReplaceKeyTest(instance, keyFrom, keyTo)
				}
		)
	)
}
