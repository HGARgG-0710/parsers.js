import assert from "assert"
import { it } from "node:test"

import type { EffectiveNestedStream } from "../../../../../dist/src/Stream/NestedStream/interfaces.js"

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

export function NestedStreamCurrNestedTest(
	stream: EffectiveNestedStream,
	currNestedList: NestedStreamCurrNestedTreeList
) {
	it("property: .currNested", () =>
		NestedStreamCurrNestedPreTest(stream, currNestedList))
}
