import assert from "assert"
import { it } from "node:test"

import { function as _f } from "@hgargg-0710/one"
const { and } = _f

import type { EffectiveNestedStream } from "../../../../../dist/src/Stream/NestedStream/interfaces.js"
import { isNestedStream } from "../../../../../dist/src/Stream/NestedStream/utils.js"
import { ClassConstructorTest } from "lib/lib.js"
import { isStreamClassInstance } from "../../../../../dist/src/Stream/StreamClass/utils.js"

type NestedStreamCurrNestedTreeList = (false | NestedStreamCurrNestedTreeList)[]

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

const isNestedStreamInternal = and(isNestedStream, isStreamClassInstance) as (
	x: any
) => x is EffectiveNestedStream

const NestedStreamConstructorTest =
	ClassConstructorTest<EffectiveNestedStream>(isNestedStreamInternal)
