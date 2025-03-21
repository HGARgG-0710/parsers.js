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

import type {
	ITree,
	IWalkableTree
} from "../../../../../dist/src/Tree/interfaces.js"
import type { IMultiIndex } from "../../../../../dist/src/Position/MultiIndex/interfaces.js"

import { TreeWalker } from "../../../../../dist/src/Tree/classes.js"

import { isMultiIndexModifier } from "Position/MultiIndex/MultiIndexModifier/lib/classes.js"
import { isPosed } from "Stream/StreamClass/lib/classes.js"
import { isMultiIndex } from "Position/MultiIndex/lib/classes.js"

import {
	ClassConstructorTest,
	classTest,
	method,
	methodTest,
	signatures,
	comparisonMethodTest
} from "lib/lib.js"

import { object, type, functional, array } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type
const { and, repeat } = functional
const { last, same } = array

export const isTreeWalker = and(
	structCheck({
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
) as type.TypePredicate<TreeWalker>

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
				const prevLast = last(instance.pos.get() as number[])
				instance[methodName]()
				assert.strictEqual(
					prevLast - (-1) ** i,
					last(instance.pos.get() as number[])
				)
			})
		}
)

function TreeWalkerIndexCutTest(instance: TreeWalker, length: number) {
	method("indexCut", () => {
		instance.indexCut(length)
		assert.strictEqual(instance.pos.levels, length)
	})
}

const TreeWalkerIsChildTest = methodTest<TreeWalker>("isChild")
const TreeWalkerIsParentTest = methodTest<TreeWalker>("isParent")
const TreeWalkerLastLevelWithSiblingsTest = methodTest<TreeWalker>(
	"lastLevelWithSiblings"
)

const TreeWalkerCurrentLastIndexTest = comparisonMethodTest(
	"currentLastIndex",
	same
)

function TreeWalkerGoPrevLastTest(instance: TreeWalker, greater: boolean) {
	method("goPrevLast", () => {
		const length = instance.pos.levels
		instance.goPrevLast()
		assert(
			greater
				? length < instance.pos.levels
				: length === instance.pos.levels
		)
	})
}

function TreeWalkerRenewLevelTest(
	instance: TreeWalker,
	expected: ITree,
	init: IWalkableTree,
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
		assert.strictEqual(instance.curr, instance.get())
		assert.strictEqual(instance.level, instance.get())
		assert.strictEqual(instance.pos.levels, 0)
	})
}

function TreeWalkerGoIndexTest(instance: TreeWalker, pos: IMultiIndex) {
	method(
		"goIndex",
		() => {
			const input = instance.get()
			instance.goIndex(pos)
			assert.strictEqual(instance.pos, pos)
			assert.strictEqual(instance.curr, input.index(pos.get()))
		},
		pos
	)
}

function TreeWalkerInitializeTest(instance: TreeWalker, input?: IWalkableTree) {
	method(
		"init",
		() => {
			instance.init(input)
			if (input) assert.strictEqual(instance.get(), input)
		},
		input
	)
}

function GoIndexTest(test: (instance?: TreeWalker, ...input: any[]) => any) {
	return function (
		instance: TreeWalker,
		index?: IMultiIndex,
		...input: any[]
	) {
		if (index) instance.goIndex(index)
		test(instance, ...input)
	}
}

type TreeWalkerTestSignature = {
	treeInput: [ITree, IMultiIndex?]
	pushTests: [number, IMultiIndex?][]
	popTests: [number, IMultiIndex?][]
	isSiblingAfterTests: [boolean, IMultiIndex?][]
	isSiblingBeforeTests: [boolean, IMultiIndex?][]
	goSiblingAfterTests: [number, IMultiIndex?][]
	goSiblingBeforeTests: [number, IMultiIndex?][]
	indexCutTests: [number, IMultiIndex?][]
	isChildTests: [boolean, IMultiIndex?][]
	isParentTests: [boolean, IMultiIndex?][]
	lastLevelWithSiblingsTests: [number, IMultiIndex?][]
	currentLastIndexTests: [number, IMultiIndex?][]
	goPrevLastTests: [boolean, IMultiIndex?][]
	renewLevelTests: [ITree, ITree, number, number, IMultiIndex?][]
	restartTests: IMultiIndex[]
	goIndexTests: IMultiIndex[]
	initTests: IWalkableTree[]
}

export function TreeWalkerClassTest(
	className: string,
	walkerConstructor: new (tree: ITree, multind?: IMultiIndex) => TreeWalker,
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
						repeat(
							() =>
								GoIndexTest(TreeWalkerPushFirstChildTest)(
									instance,
									index
								),
							times
						)

					// .popChild
					for (const [times, index] of popTests)
						repeat(
							() =>
								GoIndexTest(TreeWalkerPopChildTest)(
									instance,
									index
								),
							times
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
						repeat(
							() =>
								GoIndexTest(TreeWalkerGoSiblingAfterTest)(
									instance,
									index
								),
							times
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
						repeat(
							() =>
								GoIndexTest(TreeWalkerGoSiblingBeforeTest)(
									instance,
									index
								),
							times
						)

					// .indexCut
					for (const [length, index] of cutLength)
						GoIndexTest(TreeWalkerIndexCutTest)(
							instance,
							index,
							length
						)

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
						GoIndexTest(TreeWalkerIsParentTest)(
							instance,
							index,
							expected
						)

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
						GoIndexTest(TreeWalkerGoPrevLastTest)(
							instance,
							index,
							expected
						)

					// .renewLevel
					for (const [
						expected,
						init,
						from,
						until,
						times
					] of renewLevelTests)
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
					for (const input of initTests)
						TreeWalkerInitializeTest(instance, input)
				}
		)
	)
}
