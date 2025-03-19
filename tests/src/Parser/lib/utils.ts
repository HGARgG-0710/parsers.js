import assert from "assert"

import type { IReversibleStream } from "../../../../dist/src/Stream/ReversibleStream/interfaces.js"
import type { IPosition } from "../../../../dist/src/Position/interfaces.js"

import { flexibleUtilTest, util, utilTest } from "lib/lib.js"

import { utils } from "../../../../dist/main.js"
const { has, skip, consume } = utils.Parser

export const hasTest = utilTest(has, "has")

export function skipTest(
	stream: IReversibleStream,
	pos: IPosition,
	expectedElem: any
) {
	util("skip", () => {
		skip(stream, pos)
		assert.strictEqual(stream.curr, expectedElem)
	})
}

export const arrayTest = flexibleUtilTest(consume, "consume")
