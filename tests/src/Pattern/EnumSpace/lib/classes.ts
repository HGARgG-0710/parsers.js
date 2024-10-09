import { describe, it } from "node:test"
import assert from "node:assert"

import type {
	EnumSpace,
	Mappable
} from "../../../../../dist/src/Pattern/EnumSpace/interfaces.js"
import { arraysSame, ClassConstructorTest } from "lib/lib.js"

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

function EnumSpaceCopyTest(enumInstance: EnumSpace) {
	it("method: .copy", () => {
		const copy = enumInstance.copy()
		assert.notStrictEqual(copy, enumInstance)

		assert.strictEqual(enumInstance.size, copy.size)
		assert.strictEqual(enumInstance.add, copy.add)
		assert.strictEqual(enumInstance.join, copy.join)
		assert.strictEqual(enumInstance.copy, copy.copy)
		assert.strictEqual(enumInstance.map, copy.map)

		assert(enumEquality(enumInstance, copy))
	})
}

function EnumSpaceAddTest(enumInstance: EnumSpace, increases: number[]) {
	for (const n of increases) {
		it(`method: .add(${n})`, () => {
			const initial = enumInstance.copy()
			enumInstance.add(n)
			assert(enumInstance.size - initial.size === n)
			assert(!enumEquality(enumInstance, initial))
		})
	}
}

function EnumSpaceJoinTest(enumInstance: EnumSpace, joined: EnumSpace[]) {
	for (const space of joined) {
		it(`method: .join(${enumInstance.size}, ${space.size})`, () => {
			const currJoined = enumInstance.copy().join(space)
			assert.notStrictEqual(currJoined, enumInstance)
			if (space.size) assert(!enumEquality(enumInstance, currJoined))
		})
	}
}

function EnumSpaceMapTest(enumInstance: EnumSpace, mapTests: [Mappable, any[]][]) {
	for (const [f, out] of mapTests)
		it(`method: .map(${out.toString()})`, () => {
			assert(arraysSame(enumInstance.map(f), out))
		})
}

type EnumSpaceClassTestSignature = {
	size: number
	increases: number[]
	joined: EnumSpace[]
	mapTests: [Mappable, any[]][]
}

export function EnumSpaceTest(
	className: string,
	enumConstructor: new (size: number) => EnumSpace,
	instances: EnumSpaceClassTestSignature[]
) {
	describe(`class: (EnumSpace) ${className}`, () => {
		for (const instance of instances) {
			const { size, increases, joined, mapTests } = instance
			const enumInstance = EnumSpaceConstructorTest(enumConstructor, size)

			EnumSpaceCopyTest(enumInstance) // 				.copy
			EnumSpaceAddTest(enumInstance, increases) // 	.add
			EnumSpaceJoinTest(enumInstance, joined) //		.join
			EnumSpaceMapTest(enumInstance, mapTests) //		.map
		}
	})
}
