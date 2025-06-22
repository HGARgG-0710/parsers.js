import assert from "assert"
import type { IDefaulting } from "../../../dist/src/interfaces.js"
import { MethodTest } from "../lib.js"

export const _default = new MethodTest("default", function <Default = any>(
	this: IDefaulting<Default>,
	expected: Default
) {
	assert.strictEqual(this.default, expected)
})
