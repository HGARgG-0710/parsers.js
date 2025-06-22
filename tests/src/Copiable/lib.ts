import assert from "assert"

export function assertDistinct<T = any>(tested: T, copy: T) {
	assert.notStrictEqual(tested, copy)
}
