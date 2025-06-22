import assert from "assert"
import type { ISizeable } from "../../../dist/src/interfaces.js"
import { MethodTest } from "../lib.js"

export function sizeTest(tested: ISizeable, expected: number) {
	assert.strictEqual(tested.size, expected)
}

export function sameSizeTest(a: ISizeable, b: ISizeable) {
	assert.strictEqual(a.size, b.size)
}

export const size = new MethodTest("size", function (
	this: ISizeable,
	size: number
) {
	assert.strictEqual(this.size, size)
})

export function sizeOneLess(
	tested: ISizeable,
	callback: (t: ISizeable) => void
) {
	const oldSize = tested.size
	callback(tested)
	assert.strictEqual(tested.size, oldSize - 1)
}

export function sizeUnchanged(
	tested: ISizeable,
	callback: (t: ISizeable, oldSize: number) => void
) {
	const oldSize = tested.size
	callback(tested, oldSize)
	assert.strictEqual(tested.size, oldSize)
}

export function sizeOneMore(
	tested: ISizeable,
	callback: (t: ISizeable) => void
) {
	const oldSize = tested.size
	callback(tested)
	assert.strictEqual(tested.size, oldSize + 1)
}
