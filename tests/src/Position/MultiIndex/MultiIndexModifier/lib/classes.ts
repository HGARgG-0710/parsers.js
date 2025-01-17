import assert from "node:assert"

import type { MultiIndex } from "../../../../../../dist/src/Position/MultiIndex/interfaces.js"
import type { MultiIndexModifier } from "../../../../../../dist/src/Position/MultiIndex/MultiIndexModifier/interfaces.js"
import { isMultiIndex } from "Position/MultiIndex/lib/classes.js"

import {
	arraysSame,
	ClassConstructorTest,
	classTest,
	method,
	signatures
} from "lib/lib.js"

import { object, type, array } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type
const { last } = array

export const isMultiIndexModifier = structCheck<MultiIndexModifier>({
	multind: isMultiIndex,
	init: isFunction,
	nextLevel: isFunction,
	prevLevel: isFunction,
	resize: isFunction,
	clear: isFunction,
	incLast: isFunction,
	decLast: isFunction,
	extend: isFunction
})

const MultiIndexModifierConstructorTest = ClassConstructorTest<MultiIndexModifier>(
	isMultiIndexModifier,
	["nextLevel", "prevLevel", "resize", "clear", "incLast", "decLast", "extend"],
	["multind"]
)

function MultiIndexModifierNextLevelTest(instance: MultiIndexModifier) {
	method("nextLevel", () => {
		const oldLength = instance.multind.value.length
		instance.nextLevel()
		assert.strictEqual(oldLength, instance.multind.value.length - 1)
		assert.strictEqual(last(instance.multind.value), 0)
	})
}

function MultiIndexModifierPrevLevelTest(instance: MultiIndexModifier) {
	method("prevLevel", () => {
		const sliced = instance.multind.slice(0, -1)
		instance.prevLevel()
		assert(arraysSame(sliced, instance.multind.value))
	})
}

function MultiIndexModifierResizeTest(instance: MultiIndexModifier, size: number) {
	method(
		"resize",
		() => {
			const sliced = instance.multind.slice(0, size)
			instance.resize(size)
			assert(arraysSame(sliced, instance.multind.value))
		},
		size
	)
}

function MultiIndexModifierClearTest(instance: MultiIndexModifier) {
	method("clear", () => {
		instance.clear()
		assert.strictEqual(instance.multind.value.length, 0)
	})
}

const [MultiIndexModifierIncLastTest, MultiIndexModifierDecLastTest] = [
	"incLast",
	"decLast"
].map(
	(name, i) =>
		function (instance: MultiIndexModifier) {
			method(name, () => {
				const lastItem = last(instance.multind.value)
				instance[name]()
				assert.strictEqual(lastItem + (-1) ** i, last(instance.multind.value))
			})
		}
)

function MultiIndexModifierExtendTest(
	instance: MultiIndexModifier,
	expectedValue: number[],
	subIndex: number[]
) {
	method(
		"extend",
		() => {
			instance.extend(subIndex)
			assert(arraysSame(instance.multind.value, expectedValue))
		},
		subIndex
	)
}

function MultiIndexModifierInitTest(instance: MultiIndexModifier, multind: MultiIndex) {
	method(
		"init",
		() => {
			instance.init(multind)
			assert.strictEqual(multind, instance.multind)
		},
		multind
	)
}

export type MultiIndexModifierTestSignature = {
	multindex: MultiIndex
	nextLevelTimes: number
	prevLevelTimes: number
	resizes: number[]
	incTimes: number
	decTimes: number
	extensions: [number[], number[]][]
	initTests: MultiIndex[]
}

export function MultiIndexModifierTest(
	className: string,
	modifierConstructor: new (...input: any[]) => MultiIndexModifier,
	testSignatures: MultiIndexModifierTestSignature[]
) {
	classTest(`(MultiIndexModifier) ${className}`, () =>
		signatures(
			testSignatures,
			({
					multindex,
					nextLevelTimes,
					prevLevelTimes,
					resizes,
					incTimes,
					decTimes,
					extensions,
					initTests
				}) =>
				() => {
					const instance = MultiIndexModifierConstructorTest(
						modifierConstructor,
						multindex
					)

					// .nextLevel
					for (let i = 0; i < nextLevelTimes; ++i)
						MultiIndexModifierNextLevelTest(instance)

					// .incLast
					for (let i = 0; i < incTimes; ++i)
						MultiIndexModifierIncLastTest(instance)

					// .prevLevel
					for (let i = 0; i < prevLevelTimes; ++i)
						MultiIndexModifierPrevLevelTest(instance)

					// .resize
					for (const resize of resizes)
						MultiIndexModifierResizeTest(instance, resize)

					// .extend
					for (const [extension, expected] of extensions)
						MultiIndexModifierExtendTest(instance, expected, extension)

					// .decLast
					for (let i = 0; i < decTimes; ++i)
						MultiIndexModifierDecLastTest(instance)

					// .clear
					MultiIndexModifierClearTest(instance)

					// .init
					for (const initind of initTests)
						MultiIndexModifierInitTest(instance, initind)
				}
		)
	)
}
