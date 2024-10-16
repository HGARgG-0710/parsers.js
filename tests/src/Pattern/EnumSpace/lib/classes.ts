import assert from "node:assert"

import type {
	EnumSpace,
	Mappable
} from "../../../../../dist/src/Pattern/EnumSpace/interfaces.js"
import {
	arraysSame,
	ClassConstructorTest,
	classTest,
	method,
	signatures,
	comparisonMethodTest
} from "lib/lib.js"

import { object, boolean, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type
const { T } = boolean

const isEnumSpace = structCheck<EnumSpace>({
	value: T,
	add: isFunction,
	map: isFunction,
	join: isFunction,
	copy: isFunction
})

function enumEquality(enumSpaceOrig: EnumSpace, enumSpaceCompared: EnumSpace) {
	return arraysSame(
		enumSpaceOrig.map((x) => x),
		enumSpaceCompared.map((x) => x)
	)
}

const EnumSpaceConstructorTest = ClassConstructorTest(
	isEnumSpace,
	["add", "map", "join", "copy"],
	["value"]
)

function EnumSpaceCopyTest(instance: EnumSpace) {
	method("copy", () => {
		const copy = instance.copy()
		assert.notStrictEqual(copy, instance)

		assert.strictEqual(instance.size, copy.size)
		assert.strictEqual(instance.add, copy.add)
		assert.strictEqual(instance.join, copy.join)
		assert.strictEqual(instance.copy, copy.copy)
		assert.strictEqual(instance.map, copy.map)

		assert(enumEquality(instance, copy))
	})
}

function EnumSpaceAddTest(instance: EnumSpace, n: number) {
	method(
		"add",
		() => {
			const initSize = instance.size
			instance.add(n)
			assert(instance.size - initSize === n)
		},
		n
	)
}

function EnumSpaceJoinTest(instance: EnumSpace, space: EnumSpace) {
	method(
		"join",
		() => {
			const initSize = instance.size
			instance.join(space)
			assert(instance.size - initSize === space.size)
		},
		space
	)
}

const EnumSpaceMapTest = comparisonMethodTest<EnumSpace>("map", arraysSame)

type EnumSpaceClassTestSignature = {
	size: number
	increases: number[]
	joined: EnumSpace[]
	mapTests: [Mappable, any[]][]
}

export function EnumSpaceTest(
	className: string,
	enumConstructor: new (size: number) => EnumSpace,
	testSignatures: EnumSpaceClassTestSignature[]
) {
	classTest(`(EnumSpace) ${className}`, () =>
		signatures(testSignatures, ({ size, increases, joined, mapTests }) => () => {
			const instance = EnumSpaceConstructorTest(enumConstructor, size)

			// .copy
			EnumSpaceCopyTest(instance)

			// .add
			for (const n of increases) EnumSpaceAddTest(instance, n)

			// .join
			for (const space of joined) EnumSpaceJoinTest(instance, space)

			// .map
			for (const [f, out] of mapTests) EnumSpaceMapTest(instance, out, f)
		})
	)
}
