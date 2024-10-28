import { flexibleUtilTest, util, utilTest } from "lib/lib.js"

import type { ReversibleStream } from "../../../../dist/src/Stream/ReversibleStream/interfaces.js"
import type { Position } from "../../../../dist/src/Position/interfaces.js"

import { utils } from "../../../../dist/main.js"
import assert from "assert"
const { has, skip, nested, array } = utils.Parser

export const hasTest = utilTest(has, "has")

export function skipTest(stream: ReversibleStream, pos: Position, expectedElem: any) {
	util("skip", () => {
		skip(stream, pos)
		assert.strictEqual(stream.curr, expectedElem)
	})
}

export const nestedTest = flexibleUtilTest(nested, "nested")
export const arrayTest = flexibleUtilTest(array, "array")
