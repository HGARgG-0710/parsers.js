import assert from "node:assert"

import type { ITokenInstance } from "../../../../dist/src/Token/interfaces.js"
import type { IEnumSpace } from "../../../../dist/src/EnumSpace/interfaces.js"
import type { IMappable } from "../../../../dist/src/interfaces.js"

import {
	ClassConstructorTest,
	classTest,
	method,
	signatures,
	uniquenessTest
} from "lib/lib.js"

import { object, boolean, type, array } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type
const { T } = boolean
const { same } = array

const isEnumSpace = structCheck<IEnumSpace>({
	value: T,
	add: isFunction,
	map: isFunction,
	join: isFunction,
	copy: isFunction
})

const assertSize = (instance: IEnumSpace) =>
	assert.strictEqual(instance.map().length, instance.size)

function enumEquality(
	enumSpaceOrig: IEnumSpace,
	enumSpaceCompared: IEnumSpace
) {
	return same(enumSpaceOrig.map(), enumSpaceCompared.map())
}

const EnumSpaceConstructorTest = ClassConstructorTest(
	isEnumSpace,
	["add", "map", "join", "copy"],
	["value"]
)

function EnumSpaceCopyTest(
	instance: IEnumSpace,
	signature: ReducedEnumSpaceTestSignature
) {
	method("copy", () => {
		const copy = instance.copy()
		assert.notStrictEqual(copy, instance)

		assertSize(instance)
		assertSize(copy)

		assert.strictEqual(instance.size, copy.size)
		assert.strictEqual(instance.add, copy.add)
		assert.strictEqual(instance.join, copy.join)
		assert.strictEqual(instance.copy, copy.copy)
		assert.strictEqual(instance.map, copy.map)

		assert(enumEquality(instance, copy))
		ChainEnumSpaceTest(instance, signature)
	})
}

function EnumSpaceAddTest(instance: IEnumSpace, n: number) {
	method(
		"add",
		() => {
			const initSize = instance.size
			instance.add(n)
			assert(instance.size - initSize === n)
			assertSize(instance)
		},
		n
	)
}

function EnumSpaceJoinTest(instance: IEnumSpace, space: IEnumSpace) {
	method(
		"join",
		() => {
			const initSize = instance.size
			instance.join(space)
			assert(instance.size - initSize === space.size)
			assertSize(instance)
		},
		space
	)
}

function EnumSpaceMapTest(
	instance: IEnumSpace,
	compare: (x: any, y: any, i?: number) => boolean,
	f: IMappable
) {
	method("map", () => {
		const mapped = instance.map()
		const mappedTested = instance.map(f)
		assertSize(instance)
		assert(same(mappedTested, mapped, compare))
	})
}

// NOTE: this is to test the most important property of EnumSpace-s, that all its elements are DISJOINT (otherwise, the structure becomes inherently useless);
const EnumSpaceUniquenessTest = (instance: IEnumSpace) =>
	uniquenessTest(instance.map())

type EnumSpaceClassTestSignature = {
	size: number
} & ReducedEnumSpaceTestSignature

type ReducedEnumSpaceTestSignature = {
	increases: number[]
	joined: IEnumSpace[]
	mapTests: [IMappable, (x: any, y: any, i?: number) => boolean][]
	isCopyTest?: boolean
	furtherSignature?: ReducedEnumSpaceTestSignature
}

export function EnumSpaceTest(
	className: string,
	enumConstructor: new (size: number) => IEnumSpace,
	testSignatures: EnumSpaceClassTestSignature[]
) {
	classTest(`(EnumSpace) ${className}`, () =>
		signatures(
			testSignatures,
			({
					size,
					increases,
					joined,
					mapTests,
					isCopyTest,
					furtherSignature
				}) =>
				() =>
					ChainEnumSpaceTest(
						EnumSpaceConstructorTest(enumConstructor, size),
						{
							increases,
							joined,
							mapTests,
							isCopyTest,
							furtherSignature
						}
					)
		)
	)
}

function ChainEnumSpaceTest(
	instance: IEnumSpace,
	signature: ReducedEnumSpaceTestSignature
) {
	const { increases, joined, mapTests, isCopyTest, furtherSignature } =
		signature

	if (isCopyTest === false) assert(isEnumSpace(instance))

	// .copy
	if ((isCopyTest || isCopyTest === undefined) && furtherSignature)
		EnumSpaceCopyTest(instance, furtherSignature)

	// .add
	for (const n of increases) EnumSpaceAddTest(instance, n)

	// .join
	for (const space of joined) EnumSpaceJoinTest(instance, space)

	// .map
	for (const [f, compare] of mapTests) EnumSpaceMapTest(instance, compare, f)

	// uniqueness property
	EnumSpaceUniquenessTest(instance)
}
