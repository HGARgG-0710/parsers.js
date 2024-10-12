import assert from "assert"
import { it } from "node:test"

import type { EffectiveNestedStream } from "../../../../../dist/src/Stream/NestedStream/interfaces.js"
import {
	blockExtension,
	ClassConstructorTest,
	InitClassConstructorTest
} from "lib/lib.js"

import { function as _f, object, typeof as type } from "@hgargg-0710/one"
import {
	InitStreamClassConstructorTest,
	isInputted,
	isPosed,
	isSuperable,
	StreamClassConstructorTest
} from "Stream/StreamClass/lib/classes.js"
import { isFastLookupTable } from "IndexMap/FastLookupTable/lib/classes.js"
const { and } = _f
const { structCheck } = object
const { isBoolean } = type

type NestedStreamCurrNestedTreeList = (false | NestedStreamCurrNestedTreeList)[]

export function GeneratedNestedStreamTest(hasPosition: boolean = false) {
	function NestedStreamCurrNestedPreTest(
		stream: EffectiveNestedStream,
		currNestedList: NestedStreamCurrNestedTreeList
	) {
		let i = 0
		while (!stream.isEnd) {
			assert(currNestedList.length > i)
			const expectedCurrNested = currNestedList[i]
			assert.strictEqual(stream.currNested, !!expectedCurrNested)
			if (expectedCurrNested)
				NestedStreamCurrNestedPreTest(stream.curr, expectedCurrNested)
			stream.next()
			++i
		}
	}

	function NestedStreamCurrNestedTest(
		stream: EffectiveNestedStream,
		currNestedList: NestedStreamCurrNestedTreeList
	) {
		it("property: .currNested", () =>
			NestedStreamCurrNestedPreTest(stream, currNestedList))
	}

	const nestedStreamPrototypeProps = ["super", "typesTable"]
	const nestedStreamOwnProps = ["currNested", "input"].concat(
		hasPosition ? ["pos"] : []
	)

	const isNestedStream = and(
		structCheck({
			typesTable: isFastLookupTable,
			currNested: isBoolean
		}),
		...([isInputted, isSuperable] as ((x: any) => boolean)[]).concat(
			hasPosition ? [isPosed] : []
		)
	) as (x: any) => x is EffectiveNestedStream

	const NestedStreamConstructorTest = blockExtension(
		StreamClassConstructorTest,
		ClassConstructorTest<EffectiveNestedStream>(
			isNestedStream,
			nestedStreamPrototypeProps,
			nestedStreamOwnProps
		)
	)

	const InitNestedStreamConstructorTest = blockExtension(
		InitStreamClassConstructorTest,
		InitClassConstructorTest<EffectiveNestedStream>(
			isNestedStream,
			nestedStreamPrototypeProps,
			nestedStreamOwnProps
		)
	)
}
