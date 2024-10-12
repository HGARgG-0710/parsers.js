import { describe, it } from "node:test"
import assert from "assert"

import type { InternalHash } from "../../../../../dist/src/IndexMap/HashMap/InternalHash/interfaces.js"
import { ClassConstructorTest, methodTest, setMethodTest } from "lib/lib.js"
import { isDeletable, isKeyReplaceable, isSettable } from "IndexMap/lib/classes.js"

import { object, function as _f, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { and } = _f
const { isFunction, isObject } = type

export const isInternalHash = and(
	structCheck({
		sub: isObject,
		get: isFunction
	}),
	isSettable,
	isDeletable,
	isKeyReplaceable
) as (x: any) => x is InternalHash

const InternalHashConstructorTest = ClassConstructorTest<InternalHash>(
	isInternalHash,
	["set", "delete", "replaceKey", "get"],
	["sub"]
)

const InternalHashSetTest = setMethodTest<InternalHash>("set", "get")
const InternalHashGetTest = methodTest<InternalHash>("get")

function InternalHashDeleteTest(instance: InternalHash, key: any) {
	it(`method: .delete(${key.toString()})`, () => {
		instance.delete(key)
		assert.strictEqual(instance.get(key), instance.default)
	})
}

function InternalHashReplaceKeyTest(instance: InternalHash, keyFrom: any, keyTo: any) {
	it(`method: .replaceKey(${(keyFrom.toString(), keyTo.toString())})`, () => {
		const value = instance.get(keyFrom)
		instance.replaceKey(keyFrom, keyTo)
		assert.strictEqual(value, instance.get(keyTo))
		assert.strictEqual(instance.default, instance.get(keyFrom))
	})
}

type InternalHashTestSignature = {
	sub: any
	getTests: [any, any][]
	setTests: [any, any][]
	deleteTests: any[]
	replaceKeyTests: [any, any][]
}

export function InternalHashTest(
	className: string,
	hashConstructor: new (...x: any[]) => InternalHash,
	signatures: InternalHashTestSignature[]
) {
	describe(`class: (InternalHash) ${className}`, () => {
		for (const signature of signatures) {
			const { sub, getTests, setTests, deleteTests, replaceKeyTests } = signature
			const instance = InternalHashConstructorTest(hashConstructor, sub)

			// .get
			for (const [key, value] of getTests)
				InternalHashGetTest(instance, [key], value)

			// .set
			for (const [key, value] of setTests)
				InternalHashSetTest(instance, [key, value], value)

			// .delete
			for (const key of deleteTests) InternalHashDeleteTest(instance, key)

			// .replaceKey
			for (const [keyFrom, keyTo] of replaceKeyTests)
				InternalHashReplaceKeyTest(instance, keyFrom, keyTo)
		}
	})
}
