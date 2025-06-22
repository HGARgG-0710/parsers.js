import assert from "assert"
import type { IFreezable, IUnfreezable } from "../../../dist/src/interfaces.js"
import { MethodTest } from "../lib.js"

function baseIsFrozenAssert(buffer: IFreezable, expected: boolean) {
	assert.strictEqual(buffer.isFrozen, expected)
}

export const isFrozen = new MethodTest("isFrozen", function (
	this: IFreezable,
	expected: boolean
) {
	baseIsFrozenAssert(this, expected)
})

export const freeze = new MethodTest("freeze", function (this: IFreezable) {
	this.freeze()
	baseIsFrozenAssert(this, true)
})

export const unfreeze = new MethodTest("unfreeze", function (
	this: IUnfreezable
) {
	this.unfreeze()
	baseIsFrozenAssert(this, false)
})
