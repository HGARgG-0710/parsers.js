import assert from "assert"
import type { IIndexed, IReadable } from "../../../dist/src/interfaces.js"
import { MethodTest } from "../lib.js"

export const read = new MethodTest("read", function <T = any>(
	this: IReadable<T>,
	from: number,
	to: number,
	expected: IIndexed<T>
) {
	assert(from < to || (from === to && from === 0))
	assert.strictEqual(to - from, expected.length)
	for (let i = from, j = 0; i < to; ++i, ++j)
		assert.strictEqual(this.read(i), expected[j])
})
