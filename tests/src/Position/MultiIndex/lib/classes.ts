import assert from "node:assert"

import type { ITreeStream } from "../../../../../dist/src/Stream/TreeStream/interfaces.js"
import type { IMultiIndex } from "../../../../../dist/src/Position/MultiIndex/interfaces.js"

import {
	ClassConstructorTest,
	classTest,
	method,
	methodTest,
	signatures,
	comparisonMethodTest
} from "lib/lib.js"

import { object, type, array } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction, isArray } = type
const { same } = array

export const isMultiIndex = structCheck({
	value: isArray,
	convert: isFunction,
	compare: isFunction,
	equals: isFunction,
	copy: isFunction,
	slice: isFunction,
	firstLevel: isFunction,
	lastLevel: isFunction
}) as (x: any) => x is IMultiIndex

const MultiIndexConstructorTest = ClassConstructorTest<IMultiIndex>(
	isMultiIndex,
	[
		"convert",
		"compare",
		"equals",
		"copy",
		"slice",
		"firstLevel",
		"lastLevel"
	],
	["value"]
)

const MultiIndexEqualsTest = methodTest<IMultiIndex>("equals")

const levelComparison = (x: [number], y: [number]) => x[0] === y[0]
const MultiIndexFirstLevelTest = comparisonMethodTest<IMultiIndex>(
	"firstLevel",
	levelComparison
)
const MultiIndexLastLevelTest = comparisonMethodTest<IMultiIndex>(
	"lastLevel",
	levelComparison
)

function MultiIndexCopyTest(
	instance: IMultiIndex,
	furtherSignature: ReducedMultiIndexTestSignature
) {
	method("copy", () => {
		const copy = instance.copy()
		assert(same(instance.value, copy.value))
		ChainMultiIndexTest(instance, furtherSignature)
	})
}

function MultiIndexSliceTest(instance: IMultiIndex, from: number, to: number) {
	method("slice", () => {
		const copy = instance.copy()
		const arr = instance.value.slice(from, to)
		assert(same(arr, instance.slice(from, to)))
		assert(instance.equals(copy)) // ensuring non-mutating nature of the method
	})
}

const MultiIndexConvertTest = methodTest<IMultiIndex>("convert")
const MultiIndexCompareTest = methodTest<IMultiIndex>("compare")

type MultiIndexTestSignature = {
	value: number[]
} & ReducedMultiIndexTestSignature

type ReducedMultiIndexTestSignature = {
	conversionTests: [ITreeStream, number][]
	comparisonTests: [IMultiIndex[], boolean][]
	sliceTests: [number, number][]
	equalsTests: [IMultiIndex, boolean][]
	firstLevelTest: number
	lastLevelTest: number
	isCopyTest?: boolean
	furtherSignature?: ReducedMultiIndexTestSignature
}

export function MultiIndexTest(
	className: string,
	multindConstructor: new (...input: any[]) => IMultiIndex,
	testSignatures: MultiIndexTestSignature[]
) {
	classTest(`(MultiIndex) ${className}`, () =>
		signatures(
			testSignatures,
			({
					value,
					conversionTests,
					comparisonTests,
					sliceTests,
					equalsTests,
					firstLevelTest,
					lastLevelTest,
					isCopyTest,
					furtherSignature
				}) =>
				() => {
					ChainMultiIndexTest(
						MultiIndexConstructorTest(multindConstructor, value),
						{
							conversionTests,
							comparisonTests,
							sliceTests,
							equalsTests,
							firstLevelTest,
							lastLevelTest,
							isCopyTest,
							furtherSignature
						}
					)
				}
		)
	)
}

function ChainMultiIndexTest(
	instance: IMultiIndex,
	signature: ReducedMultiIndexTestSignature
) {
	const {
		conversionTests,
		comparisonTests,
		sliceTests,
		equalsTests,
		firstLevelTest,
		lastLevelTest,
		isCopyTest,
		furtherSignature
	} = signature

	if (isCopyTest === false) assert(isMultiIndex(instance))

	// .convert
	for (const [treeStream, expected] of conversionTests)
		MultiIndexConvertTest(instance, expected, treeStream)

	// .compare
	for (const [comparedWith, expected] of comparisonTests)
		MultiIndexCompareTest(instance, expected, comparedWith)

	// .slice
	for (const [from, to] of sliceTests) MultiIndexSliceTest(instance, from, to)

	// .equals
	for (const [differedWith, expected] of equalsTests)
		MultiIndexEqualsTest(instance, expected, differedWith)

	// .copy
	if ((isCopyTest || isCopyTest === undefined) && furtherSignature!)
		MultiIndexCopyTest(instance, furtherSignature)

	// .firstLevel
	MultiIndexFirstLevelTest(instance, [firstLevelTest])

	// .lastLevel
	MultiIndexLastLevelTest(instance, [lastLevelTest])
}
