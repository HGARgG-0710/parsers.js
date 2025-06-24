import assert from "assert"
import type { ISizeable } from "../../../dist/src/interfaces.js"
import { MethodTest } from "../lib.js"

export const size = new MethodTest("size", function (
	this: ISizeable,
	size: number
) {
	assert.strictEqual(this.size, size)
})
