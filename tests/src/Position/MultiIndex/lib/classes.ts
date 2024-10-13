import { describe, it } from "node:test"
import assert from "node:assert"

import type { MultiIndex } from "../../../../../dist/src/Position/MultiIndex/interfaces.js"

import {
	arraysSame,
	ClassConstructorTest,
	methodTest,
	unambigiousMethodTest
} from "lib/lib.js"

import {
	ChainMultiIndexModifierTest,
	isMultiIndexModifier,
	type MultiIndexModifierTestSignature
} from "../MultiIndexModifier/lib/classes.js"

import { object, typeof as type, function as _f } from "@hgargg-0710/one"
import type { EffectiveTreeStream } from "../../../../../dist/src/Stream/TreeStream/interfaces.js"
const { structCheck } = object
const { isFunction, isArray, isObject } = type
const { and } = _f

export const plainIsMultiIndex = structCheck({
	value: isArray,
	modifier: isObject,
	convert: isFunction,
	compare: isFunction,
	equals: isFunction,
	copy: isFunction,
	slice: isFunction,
	firstLevel: isFunction,
	lastLevel: isFunction
})

export const isMultiIndex = and(
	plainIsMultiIndex,
	structCheck({
		modifier: isMultiIndexModifier
	})
) as (x: any) => x is MultiIndex

const MultiIndexConstructorTest = ClassConstructorTest<MultiIndex>(
	isMultiIndex,
	["convert", "compare", "equals", "copy", "slice", "firstLevel", "lastLevel"],
	["value", "modifier"]
)

const MultiIndexEqualsTest = methodTest<MultiIndex>("equals")

const levelComparison = (x: [number], y: [number]) => x[0] === y[0]
const MultiIndexFirstLevelTest = unambigiousMethodTest<MultiIndex>(
	"firstLevel",
	levelComparison
)
const MultiIndexLastLevelTest = unambigiousMethodTest<MultiIndex>(
	"lastLevel",
	levelComparison
)

function MultiIndexCopyTest(instance: MultiIndex) {
	it(`method: .copy()`, () => {
		const copy = instance.copy()
		assert(arraysSame(instance.value, copy.value))
		assert(isMultiIndex(copy))
	})
}

function MultiIndexSliceTest(instance: MultiIndex, from: number, to: number) {
	it(`method: .slice()`, () => {
		const copy = instance.copy()
		const arr = instance.value.slice(from, to)
		assert(arraysSame(arr, instance.slice(from, to)))
		assert(instance.equals(copy))
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
	modifierTest: {
		modifierClassName: string
		modifierSignature: MultiIndexModifierTestSignature
	}
}

export function MultiIndexTest(
	className: string,
	multindConstructor: new (...input: any[]) => MultiIndex,
	signatures: MultiIndexTestSignature[]
) {
	describe(`class: (MultiIndex) ${className}`, () => {
		for (const signature of signatures) {
			const {
				value,
				modifierTest,
				conversionTests,
				comparisonTests,
				sliceTests,
				equalsTests,
				firstLevelTest,
				lastLevelTest
			} = signature
			const { modifierClassName, modifierSignature } = modifierTest
			const instance = MultiIndexConstructorTest(multindConstructor, value)

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
			MultiIndexCopyTest(instance)

			// .firstLevel
			MultiIndexFirstLevelTest(instance, [firstLevelTest])

			// .lastLevel
			MultiIndexLastLevelTest(instance, [lastLevelTest])

			// running the sub-suite
			ChainMultiIndexModifierTest(
				instance.modifier,
				modifierSignature,
				true,
				modifierClassName
			)
		}
	})
}
