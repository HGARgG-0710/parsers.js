import assert from "node:assert"

import type { EffectiveTreeStream } from "../../../../../dist/src/Stream/TreeStream/interfaces.js"
import type { MultiIndex } from "../../../../../dist/src/Position/MultiIndex/interfaces.js"

import {
	arraysSame,
	ClassConstructorTest,
	classTest,
	method,
	methodTest,
	signatures,
	comparisonMethodTest
} from "lib/lib.js"

import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction, isArray } = type

export const isMultiIndex = structCheck({
	value: isArray,
	convert: isFunction,
	compare: isFunction,
	equals: isFunction,
	copy: isFunction,
	slice: isFunction,
	firstLevel: isFunction,
	lastLevel: isFunction
}) as (x: any) => x is MultiIndex

const MultiIndexConstructorTest = ClassConstructorTest<MultiIndex>(
	isMultiIndex,
	["convert", "compare", "equals", "copy", "slice", "firstLevel", "lastLevel"],
	["value"]
)

const MultiIndexEqualsTest = methodTest<MultiIndex>("equals")

const levelComparison = (x: [number], y: [number]) => x[0] === y[0]
const MultiIndexFirstLevelTest = comparisonMethodTest<MultiIndex>(
	"firstLevel",
	levelComparison
)
const MultiIndexLastLevelTest = comparisonMethodTest<MultiIndex>(
	"lastLevel",
	levelComparison
)

function MultiIndexCopyTest(instance: MultiIndex) {
	method("copy", () => {
		const copy = instance.copy()
		assert(arraysSame(instance.value, copy.value))
		assert(isMultiIndex(copy))
	})
}

function MultiIndexSliceTest(instance: MultiIndex, from: number, to: number) {
	method("slice", () => {
		const copy = instance.copy()
		const arr = instance.value.slice(from, to)
		assert(arraysSame(arr, instance.slice(from, to)))
		assert(instance.equals(copy)) // ensuring non-mutating nature of the method
	})
}

const MultiIndexConvertTest = methodTest<MultiIndex>("convert")
const MultiIndexCompareTest = methodTest<MultiIndex>("compare")

type MultiIndexTestSignature = {
	value: number[]
	conversionTests: [EffectiveTreeStream, number][]
	comparisonTests: [MultiIndex[], boolean][]
	sliceTests: [number, number][]
	equalsTests: [MultiIndex, boolean][]
	firstLevelTest: number
	lastLevelTest: number
}

export function MultiIndexTest(
	className: string,
	multindConstructor: new (...input: any[]) => MultiIndex,
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
					lastLevelTest
				}) =>
				() => {
					const instance = MultiIndexConstructorTest(multindConstructor, value)

					// .convert
					for (const [treeStream, expected] of conversionTests)
						MultiIndexConvertTest(instance, expected, treeStream)

					// .compare
					for (const [comparedWith, expected] of comparisonTests)
						MultiIndexCompareTest(instance, expected, comparedWith)

					// .slice
					for (const [from, to] of sliceTests)
						MultiIndexSliceTest(instance, from, to)

					// .equals
					for (const [differedWith, expected] of equalsTests)
						MultiIndexEqualsTest(instance, expected, differedWith)

					// .copy
					MultiIndexCopyTest(instance)

					// .firstLevel
					MultiIndexFirstLevelTest(instance, [firstLevelTest])

					// .lastLevel
					MultiIndexLastLevelTest(instance, [lastLevelTest])
				}
		)
	)
}
