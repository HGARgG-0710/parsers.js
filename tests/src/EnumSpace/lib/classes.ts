import assert from "node:assert"

import type { TokenInstance } from "../../../../dist/src/Token/interfaces.js"
import type { EnumSpace, Mappable } from "../../../../dist/src/EnumSpace/interfaces.js"

import {
	arraysSame,
	ClassConstructorTest,
	classTest,
	method,
	signatures,
	uniquenessTest
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

const assertSize = (instance: EnumSpace) =>
	assert.strictEqual(instance.map().length, instance.size)

function enumEquality(enumSpaceOrig: EnumSpace, enumSpaceCompared: EnumSpace) {
	return arraysSame(enumSpaceOrig.map(), enumSpaceCompared.map())
}

const EnumSpaceConstructorTest = ClassConstructorTest(
	isEnumSpace,
	["add", "map", "join", "copy"],
	["value"]
)

function EnumSpaceCopyTest(
	instance: EnumSpace,
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

function EnumSpaceAddTest(instance: EnumSpace, n: number) {
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

function EnumSpaceJoinTest(instance: EnumSpace, space: EnumSpace) {
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
	instance: EnumSpace,
	compare: (x: any, y: any, i?: number) => boolean,
	f: Mappable
) {
	method("map", () => {
		const mapped = instance.map()
		const mappedTested = instance.map(f)
		assertSize(instance)
		assert(arraysSame(mappedTested, mapped, compare))
	})
}

// NOTE: this is to test the most important property of EnumSpace-s, that all its elements are DISJOINT (otherwise, the structure becomes inherently useless);
const EnumSpaceUniquenessTest = (instance: EnumSpace) => uniquenessTest(instance.map())

type EnumSpaceClassTestSignature = {
	size: number
} & ReducedEnumSpaceTestSignature

type ReducedEnumSpaceTestSignature = {
	increases: number[]
	joined: EnumSpace[]
	mapTests: [Mappable, (x: any, y: any, i?: number) => boolean][]
	isCopyTest?: boolean
	furtherSignature?: ReducedEnumSpaceTestSignature
}

export function EnumSpaceTest(
	className: string,
	enumConstructor: new (size: number) => EnumSpace,
	testSignatures: EnumSpaceClassTestSignature[]
) {
	classTest(`(EnumSpace) ${className}`, () =>
		signatures(
			testSignatures,
			({ size, increases, joined, mapTests, isCopyTest, furtherSignature }) =>
				() =>
					ChainEnumSpaceTest(EnumSpaceConstructorTest(enumConstructor, size), {
						increases,
						joined,
						mapTests,
						isCopyTest,
						furtherSignature
					})
		)
	)
}

function ChainEnumSpaceTest(
	instance: EnumSpace,
	signature: ReducedEnumSpaceTestSignature
) {
	const { increases, joined, mapTests, isCopyTest, furtherSignature } = signature

	if (isCopyTest === false) assert(isEnumSpace(instance))

	// .copy
	if (isCopyTest || isCopyTest === undefined)
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

type TokenMappingTestSignature = {
	instance: EnumSpace
}

export function TokenMappingTest(
	className: string,
	TokenMapping: (enums: EnumSpace) => TokenInstance[],
	testSignatures: TokenMappingTestSignature[]
) {
	classTest(`(TokenInstanceEnum) ${className}`, () => {
		signatures(testSignatures, ({ instance }) => () => {
			const mapped = instance.map()
			const tokensMapped = TokenMapping(instance)

			assert(
				arraysSame(
					mapped,
					tokensMapped,
					(x: any, y: TokenInstance) => x === y.type
				)
			)
		})
	})
}
