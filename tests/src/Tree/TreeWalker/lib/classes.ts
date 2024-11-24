import assert from "node:assert"

import type { Tree } from "../../../../../dist/src/Tree/interfaces.js"
import type { MultiIndex } from "../../../../../dist/src/Position/MultiIndex/interfaces.js"
import type { TreeWalker } from "../../../../../dist/src/Tree/TreeWalker/interfaces.js"

import { isTree } from "Tree/lib/classes.js"
import { isMultiIndexModifier } from "Position/MultiIndex/MultiIndexModifier/lib/classes.js"
import { isPosed } from "Stream/StreamClass/lib/classes.js"
import { isMultiIndex } from "Position/MultiIndex/lib/classes.js"

import {
	arraysSame,
	ClassConstructorTest,
	classTest,
	method,
	methodTest,
	signatures,
	comparisonMethodTest,
	repeat
} from "lib/lib.js"

import { object, typeof as type, function as f, array } from "@hgargg-0710/one"
import type { TypePredicate } from "../../../../../dist/src/interfaces.js"
const { structCheck } = object
const { isFunction, isUndefined } = type
const { and } = f
const { last } = array

export const isTreeWalker = and(
	structCheck({
		input: isTree,
		level: isTree,
		curr: isTree,
		modifier: isMultiIndexModifier,
		pushFirstChild: isFunction,
		popChild: isFunction,
		isSiblingAfter: isFunction,
		isSiblingBefore: isFunction,
		goSiblingAfter: isFunction,
		goSiblingBefore: isFunction,
		indexCut: isFunction,
		isChild: isFunction,
		isParent: isFunction,
		lastLevelWithSiblings: isFunction,
		currentLastIndex: isFunction,
		goPrevLast: isFunction,
		renewLevel: isFunction,
		restart: isFunction,
		goIndex: isFunction,
		init: isFunction
	}),
	isPosed(isMultiIndex)
) as TypePredicate<TreeWalker>

const TreeWalkerConstructorTest = ClassConstructorTest<TreeWalker>(
	isTreeWalker,
	[
		"pushFirstChild",
		"popChild",
		"isSiblingAfter",
		"isSiblingBefore",
		"goSiblingAfter",
		"goSiblingBefore",
		"indexCut",
		"isChild",
		"isParent",
		"lastLevelWithSiblings",
		"currentLastIndex",
		"goPrevLast",
		"renewLevel",
		"restart",
		"goIndex",
		"init"
	],
	["level", "input", "curr", "modifier"]
)

function TreeWalkerPushFirstChildTest(instance: TreeWalker) {
	method("pushFirstChild", () => {
		const lastCurr = instance.curr
		const lastLength = instance.pos.levels
		instance.pushFirstChild()
		assert.strictEqual(lastLength, instance.pos.levels - 1)
		assert.strictEqual(lastCurr, instance.level)
	})
}

function TreeWalkerPopChildTest(instance: TreeWalker) {
	method("popChild", () => {
		const lastLevel = instance.level
		const lastLength = instance.pos.levels
		instance.popChild()
		assert.strictEqual(lastLength, instance.pos.levels + 1)
		assert.strictEqual(lastLevel, instance.curr)
	})
}

const TreeWalkerIsSiblingAfterTest = methodTest<TreeWalker>("isSiblingAfter")
const TreeWalkerIsSiblingBeforeTest = methodTest<TreeWalker>("isSiblingBefore")

const [TreeWalkerGoSiblingAfterTest, TreeWalkerGoSiblingBeforeTest] = [
	"goSiblingAfter",
	"goSiblingBefore"
].map(
	(methodName, i) =>
		function (instance: TreeWalker) {
			method(methodName, () => {
				const prevLast = last(instance.pos.value)
				instance[methodName]()
				assert.strictEqual(prevLast - (-1) ** i, last(instance.pos.value))
			})
		}
)

function TreeWalkerIndexCutTest(instance: TreeWalker, length: number) {
	method("indexCut", () => {
		instance.indexCut(length)
		assert.strictEqual(instance.pos.length, length)
	})
}

const TreeWalkerIsChildTest = methodTest<TreeWalker>("isChild")
const TreeWalkerIsParentTest = methodTest<TreeWalker>("isParent")
const TreeWalkerLastLevelWithSiblingsTest = methodTest<TreeWalker>(
	"lastLevelWithSiblings"
)

const TreeWalkerCurrentLastIndexTest = comparisonMethodTest(
	"currentLastIndex",
	arraysSame
)

function TreeWalkerGoPrevLastTest(instance: TreeWalker, greater: boolean) {
	method("goPrevLast", () => {
		const length = instance.pos.levels
		instance.goPrevLast()
		assert(greater ? length < instance.pos.levels : length === instance.pos.levels)
	})
}

function TreeWalkerRenewLevelTest(
	instance: TreeWalker,
	expected: Tree,
	init: Tree,
	from: number,
	until: number = -1
) {
	method(
		"renewLevel",
		() => {
			instance.renewLevel(init, from, until)
			assert.strictEqual(instance.level, expected)
		},
		init,
		from,
		until
	)
}

function TreeWalkerRestartTest(instance: TreeWalker) {
	method("restart", () => {
		instance.restart()
		assert.strictEqual(instance.curr, instance.input)
		assert.strictEqual(instance.level, instance.input)
		assert.strictEqual(instance.pos.levels, 0)
	})
}

function TreeWalkerGoIndexTest(instance: TreeWalker, pos: MultiIndex) {
	method(
		"goIndex",
		() => {
			const input = instance.input
			instance.goIndex(pos)
			assert.strictEqual(instance.pos, pos)
			assert.strictEqual(instance.curr, input.index(pos.value))
		},
		pos
	)
}

function TreeWalkerInitializeTest(instance: TreeWalker, input?: Tree, pos?: MultiIndex) {
	method(
		"init",
		() => {
			instance.init(input, pos)
			if (input) {
				assert.strictEqual(instance.input, input)
				if (!pos) assert.strictEqual(instance.pos.levels, 0)
			}
			if (pos) {
				const input = instance.input
				assert.strictEqual(instance.pos, pos)
				assert.strictEqual(instance.curr, input.index(pos.value))
			}
		},
		input,
		pos
	)
}

type TreeWalkerTestSignature = {
	tree: Tree
	pushTimes: number
	popTimes: number
	isSiblingAfter?: boolean
	isSiblingBefore?: boolean
	afterTimes?: number
	beforeTimes?: number
	cutLength?: number
	isChild?: boolean
	isParent?: boolean
	lastLevelWithSiblings?: number
	currentLastIndex?: number[]
	goPrevLastGreater?: boolean
	renewLevelTests: [Tree, Tree, number, number][]
	shouldRestart?: any
	goIndexTests: MultiIndex[]
	initTests: [Tree?, MultiIndex?][]
}

export function TreeWalkerTest(
	className: string,
	walkerConstructor: new () => TreeWalker,
	testSignatures: TreeWalkerTestSignature[]
) {
	classTest(`(TreeWalker) ${className}`, () =>
		signatures(
			testSignatures,
			({
					tree,
					pushTimes,
					popTimes,
					isSiblingAfter,
					afterTimes,
					isSiblingBefore,
					beforeTimes,
					cutLength,
					isChild,
					isParent,
					lastLevelWithSiblings,
					currentLastIndex,
					goPrevLastGreater,
					renewLevelTests,
					shouldRestart,
					goIndexTests,
					initTests
				}) =>
				() => {
					const instance = TreeWalkerConstructorTest(walkerConstructor, tree)

					// .pushFirstChild
					repeat(pushTimes, () => TreeWalkerPushFirstChildTest(instance))

					// .popChild
					repeat(popTimes, () => TreeWalkerPopChildTest(instance))

					// .isSiblingAfter
					if (isSiblingBefore !== undefined)
						TreeWalkerIsSiblingAfterTest(instance, isSiblingAfter)

					// .goSibilngAfter
					if (isSiblingAfter && !isUndefined(afterTimes))
						repeat(afterTimes, () => TreeWalkerGoSiblingAfterTest(instance))

					// .isSiblingBefore
					if (!isUndefined(isSiblingBefore))
						TreeWalkerIsSiblingBeforeTest(instance, isSiblingBefore)

					// .goSibilngBefore
					if (isSiblingBefore && !isUndefined(beforeTimes))
						repeat(beforeTimes, () => TreeWalkerGoSiblingBeforeTest(instance))

					// .indexCut
					if (!isUndefined(cutLength))
						TreeWalkerIndexCutTest(instance, cutLength)

					// .isChild
					if (!isUndefined(isChild)) TreeWalkerIsChildTest(instance, isChild)

					// .isParent
					if (!isUndefined(isParent)) TreeWalkerIsParentTest(instance, isParent)

					// .lastLevelWithSiblings
					if (!isUndefined(lastLevelWithSiblings))
						TreeWalkerLastLevelWithSiblingsTest(
							instance,
							lastLevelWithSiblings
						)

					// .currentLastIndex
					if (!isUndefined(currentLastIndex))
						TreeWalkerCurrentLastIndexTest(instance, currentLastIndex)

					// .goPrevLast
					if (!isUndefined(goPrevLastGreater))
						TreeWalkerGoPrevLastTest(instance, goPrevLastGreater)

					// .renewLevel
					for (const [expected, init, from, until] of renewLevelTests)
						TreeWalkerRenewLevelTest(instance, expected, init, from, until)

					// .restart
					if (!isUndefined(shouldRestart)) TreeWalkerRestartTest(instance)

					// .goIndex
					for (const index of goIndexTests)
						TreeWalkerGoIndexTest(instance, index)

					// .init
					for (const [input, index] of initTests)
						TreeWalkerInitializeTest(instance, input, index)
				}
		)
	)
}
