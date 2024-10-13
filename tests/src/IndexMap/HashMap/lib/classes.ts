import { describe, it } from "node:test"
import assert from "assert"

import type { HashMap } from "../../../../../dist/src/IndexMap/HashMap/interfaces.js"
import type { InternalHash } from "../../../../../dist/src/IndexMap/HashMap/InternalHash/interfaces.js"

import {
	isDeletable,
	isIndexable,
	isKeyReplaceable,
	isSettable,
	isSizeable
} from "IndexMap/lib/classes.js"

import { ClassConstructorTest, methodTest, setMethodTest } from "lib/lib.js"

import { object, typeof as type, function as _f } from "@hgargg-0710/one"
import { isInternalHash } from "IndexMap/InternalHash/lib/classes.js"
const { structCheck } = object
const { isFunction } = type
const { and } = _f

const isHashMap = and(
	structCheck({
		hash: isFunction,
		sub: isInternalHash
	}),
	isSettable,
	isIndexable,
	isKeyReplaceable,
	isDeletable,
	isSizeable
) as (x: any) => x is HashMap

const HashMapConstructorTest = ClassConstructorTest<HashMap>(
	isHashMap,
	["index", "set", "delete", "replaceKey", "hash"],
	["sub"]
)

const HashMapIndexTest = methodTest<HashMap>("index")
const HashMapSetTest = setMethodTest<HashMap>("set", "index")

function HashMapDeleteTest(instance: HashMap, key: any) {
	it("method: .delete()", () => {
		instance.delete(key)
		assert.strictEqual(instance.index(key), instance.sub.default)
	})
}

function HashMapReplaceKeyTest(instance: HashMap, keyFrom: any, keyTo: any) {
	it("method: .replaceKey()", () => {
		const value = instance.index(keyFrom)
		instance.replaceKey(keyFrom, keyTo)
		assert.strictEqual(instance.index(keyTo), value)
		assert.strictEqual(instance.index(keyFrom), instance.sub.default)
	})
}

type HashMapTestSignature = {
	sub: InternalHash
	indexTests: [any, any][]
	setTests: [any, any][]
	deleteTests: any[]
	replaceKeyTests: [any, any][]
}

export function HashMapTest(
	className: string,
	HashMapClass: new (structure: InternalHash) => HashMap,
	signatures: HashMapTestSignature[]
) {
	describe(`class: (HashMap) ${className}`, () => {
		for (const signature of signatures) {
			const { sub, indexTests, setTests, deleteTests, replaceKeyTests } = signature
			const instance = HashMapConstructorTest(HashMapClass, sub)

			// .index
			for (const [key, value] of indexTests) HashMapIndexTest(instance, value, key)

			// .set
			for (const [key, value] of setTests)
				HashMapSetTest(instance, value, key, value)

			// .delete
			for (const key of deleteTests) HashMapDeleteTest(instance, key)

			// .replaceKey
			for (const [keyFrom, keyTo] of replaceKeyTests)
				HashMapReplaceKeyTest(instance, keyFrom, keyTo)
		}
	})
}
