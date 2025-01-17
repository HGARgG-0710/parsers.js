// TODO: THESE TESTS ARE BROKEN
// * 1. the methods must check for THE '.curr' and '.level'!
// * 2. the methods must check for THE '.multind' VALUE;
// ! not as it is currently - only the length is checked, and so forth...;
// ! Do this :
// % 	1. List all the methods that are supposed to modify the 'this.curr'/'this.level'/'this.pos' respectively;
// 		% signatures:
// 			* 1. .pushFirstChild 	- .pos [+ ARG], .level [NO ARG], .curr [+ ARG]
// 			* 2. .popChild		 	- .pos [+ ARG], .level [+ ARG],  .curr [NO ARG]
// 			* 3. .isSiblingAfter 	- 1 boolean [result];
// 			* 4. .isSiblingBefore 	- 1 boolean [result];
// 			* 5. .goSiblingAfter	-
// % 	2. Change them accordingly

import assert from "node:assert"

import type { Tree } from "../../../../../dist/src/Tree/interfaces.js"
import type { MultiIndex } from "../../../../../dist/src/Position/MultiIndex/interfaces.js"
import type { TreeWalker } from "../../../../../dist/src/Tree/TreeWalker/interfaces.js"

import type { TypePredicate } from "../../../../../dist/src/interfaces.js"

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

import { object, type, functional, array } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type
const { and } = functional
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

function GoIndexTest(test: (instance?: TreeWalker, ...input: any[]) => any) {
	return function (instance: TreeWalker, index?: MultiIndex, ...input: any[]) {
		if (index) instance.goIndex(index)
		test(instance, ...input)
	}
}

type TreeWalkerTestSignature = {
	treeInput: [Tree, MultiIndex?]
	pushTests: [number, MultiIndex?][]
	popTests: [number, MultiIndex?][]
	isSiblingAfterTests: [boolean, MultiIndex?][]
	isSiblingBeforeTests: [boolean, MultiIndex?][]
	goSiblingAfterTests: [number, MultiIndex?][]
	goSiblingBeforeTests: [number, MultiIndex?][]
	indexCutTests: [number, MultiIndex?][]
	isChildTests: [boolean, MultiIndex?][]
	isParentTests: [boolean, MultiIndex?][]
	lastLevelWithSiblingsTests: [number, MultiIndex?][]
	currentLastIndexTests: [number, MultiIndex?][]
	goPrevLastTests: [boolean, MultiIndex?][]
	renewLevelTests: [Tree, Tree, number, number, MultiIndex?][]
	restartTests: MultiIndex[]
	goIndexTests: MultiIndex[]
	initTests: [Tree?, MultiIndex?][]
}

export function TreeWalkerClassTest(
	className: string,
	walkerConstructor: new (tree: Tree, multind?: MultiIndex) => TreeWalker,
	testSignatures: TreeWalkerTestSignature[]
) {
	classTest(`(TreeWalker) ${className}`, () =>
		signatures(
			testSignatures,
			({
					treeInput,
					pushTests,
					popTests,
					isSiblingAfterTests: isSiblingAfter,
					goSiblingAfterTests,
					isSiblingBeforeTests: isSiblingBefore,
					goSiblingBeforeTests,
					indexCutTests: cutLength,
					isChildTests: isChild,
					isParentTests: isParent,
					lastLevelWithSiblingsTests: lastLevelWithSiblings,
					currentLastIndexTests: currentLastIndex,
					goPrevLastTests: goPrevLastGreater,
					renewLevelTests,
					restartTests,
					goIndexTests,
					initTests
				}) =>
				() => {
					const instance = TreeWalkerConstructorTest(
						walkerConstructor,
						...treeInput
					)

					// .pushFirstChild
					for (const [times, index] of pushTests)
						repeat(times, () =>
							GoIndexTest(TreeWalkerPushFirstChildTest)(instance, index)
						)

					// .popChild
					for (const [times, index] of popTests)
						repeat(times, () =>
							GoIndexTest(TreeWalkerPopChildTest)(instance, index)
						)

					// .isSiblingAfter
					for (const [expected, index] of isSiblingAfter)
						GoIndexTest(TreeWalkerIsSiblingAfterTest)(
							instance,
							index,
							expected
						)

					// .goSibilngAfter
					for (const [times, index] of goSiblingAfterTests)
						repeat(times, () =>
							GoIndexTest(TreeWalkerGoSiblingAfterTest)(instance, index)
						)

					// .isSiblingBefore
					for (const [expected, index] of isSiblingBefore)
						GoIndexTest(TreeWalkerIsSiblingBeforeTest)(
							instance,
							index,
							expected
						)

					// .goSibilngBefore
					for (const [times, index] of goSiblingBeforeTests)
						repeat(times, () =>
							GoIndexTest(TreeWalkerGoSiblingBeforeTest)(instance, index)
						)

					// .indexCut
					for (const [length, index] of cutLength)
						GoIndexTest(TreeWalkerIndexCutTest)(instance, index, length)

					// .isChild
					for (const [expected, index] of isChild)
						GoIndexTest(TreeWalkerIsChildTest)(
							instance,
							index,
							expected,
							isChild
						)

					// .isParent
					for (const [expected, index] of isParent)
						GoIndexTest(TreeWalkerIsParentTest)(instance, index, expected)

					// .lastLevelWithSiblings
					for (const [expected, index] of lastLevelWithSiblings)
						GoIndexTest(TreeWalkerLastLevelWithSiblingsTest)(
							instance,
							index,
							expected
						)

					// .currentLastIndex
					for (const [expected, index] of currentLastIndex)
						GoIndexTest(TreeWalkerCurrentLastIndexTest)(
							instance,
							index,
							expected
						)

					// .goPrevLast
					for (const [expected, index] of goPrevLastGreater)
						GoIndexTest(TreeWalkerGoPrevLastTest)(instance, index, expected)

					// .renewLevel
					for (const [expected, init, from, until, times] of renewLevelTests)
						GoIndexTest(TreeWalkerRenewLevelTest)(
							instance,
							times,
							expected,
							init,
							from,
							until
						)

					// .restart
					for (const index of restartTests)
						GoIndexTest(TreeWalkerRestartTest)(instance, index)

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
