import assert from "node:assert"

import type { IMultiIndex } from "../../../../../../dist/src/Position/MultiIndex/interfaces.js"
import type { IMultiIndexModifier } from "../../../../../../dist/src/Position/MultiIndex/interfaces.js"
import { isMultiIndex } from "Position/MultiIndex/lib/classes.js"

import { ClassConstructorTest, classTest, method, signatures } from "lib/lib.js"

import { object, type, array } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type
const { last, same } = array

export const isMultiIndexModifier = structCheck<IMultiIndexModifier>({
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

const MultiIndexModifierConstructorTest =
	ClassConstructorTest<IMultiIndexModifier>(
		isMultiIndexModifier,
		[
			"nextLevel",
			"prevLevel",
			"resize",
			"clear",
			"incLast",
			"decLast",
			"extend"
		],
		["multind"]
	)

function MultiIndexModifierNextLevelTest(instance: IMultiIndexModifier) {
	method("nextLevel", () => {
		const oldLength = instance.get().levels
		instance.nextLevel()
		assert.strictEqual(oldLength, instance.get().levels - 1)
		assert.strictEqual(last(instance.get().get() as number[]), 0)
	})
}

function MultiIndexModifierPrevLevelTest(instance: IMultiIndexModifier) {
	method("prevLevel", () => {
		const sliced = instance.get().slice(0, -1)
		instance.prevLevel()
		assert(same(sliced, instance.get().get()))
	})
}

function MultiIndexModifierResizeTest(
	instance: IMultiIndexModifier,
	size: number
) {
	method(
		"resize",
		() => {
			const sliced = instance.get().slice(0, size)
			instance.resize(size)
			assert(same(sliced, instance.get().get()))
		},
		size
	)
}

function MultiIndexModifierClearTest(instance: IMultiIndexModifier) {
	method("clear", () => {
		instance.clear()
		assert.strictEqual(instance.get().levels, 0)
	})
}

const [MultiIndexModifierIncLastTest, MultiIndexModifierDecLastTest] = [
	"incLast",
	"decLast"
].map(
	(name, i) =>
		function (instance: IMultiIndexModifier) {
			method(name, () => {
				const lastItem = last(instance.get().get() as number[])
				instance[name]()
				assert.strictEqual(
					lastItem + (-1) ** i,
					last(instance.get().get() as number[])
				)
			})
		}
)

function MultiIndexModifierExtendTest(
	instance: IMultiIndexModifier,
	expectedValue: number[],
	subIndex: number[]
) {
	method(
		"extend",
		() => {
			instance.extend(subIndex)
			assert(same(instance.get().get(), expectedValue))
		},
		subIndex
	)
}

function MultiIndexModifierInitTest(
	instance: IMultiIndexModifier,
	multind: IMultiIndex
) {
	method(
		"init",
		() => {
			instance.init(multind)
			assert.strictEqual(multind, instance.get())
		},
		multind
	)
}

export type MultiIndexModifierTestSignature = {
	multindex: IMultiIndex
	nextLevelTimes: number
	prevLevelTimes: number
	resizes: number[]
	incTimes: number
	decTimes: number
	extensions: [number[], number[]][]
	initTests: IMultiIndex[]
}

export function MultiIndexModifierTest(
	className: string,
	modifierConstructor: new (...input: any[]) => IMultiIndexModifier,
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
						MultiIndexModifierExtendTest(
							instance,
							expected,
							extension
						)

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
