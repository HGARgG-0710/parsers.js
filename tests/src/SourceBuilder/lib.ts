import { object, type } from "@hgargg-0710/one"
import assert from "assert"
import type { SourceBuilder } from "../../../dist/src/classes.js"
import { freeze, isFrozen, unfreeze } from "../Freezable/lib.js"
import { MethodTest, MutableClassTest } from "../lib.js"

const { structCheck } = object
const { isFunction, isBoolean } = type

export enum TestTypes {
	NON_FROZEN = 0,
	FROZEN = 1
}

const ClearableInterface = {
	interfaceName: "IClearable",
	conformance: structCheck({ clear: isFunction })
}

const AccumulatorInterface = {
	interfaceName: "IAccumulator",
	conformance: structCheck({
		copy: isFunction,
		unfreeze: isFunction,
		isFrozen: isBoolean,
		push: isFunction,
		get: isFunction,
		freeze: isFunction
	})
}

const copy = new MethodTest("copy", function (this: SourceBuilder) {
	const copied = this.copy()
	assert.strictEqual(this.isFrozen, copied.isFrozen)
	assert.strictEqual(this.get(), copied.get())
	assert.notStrictEqual(this, copied)
})

const clear = new MethodTest("clear", function (this: SourceBuilder) {
	this.clear()
	assert.strictEqual(this.get(), "")
})

const get = new MethodTest("get", function (
	this: SourceBuilder,
	expected: string
) {
	assert.strictEqual(this.get(), expected)
})

const push = new MethodTest("push", function (
	this: SourceBuilder,
	items: string[],
	expected: string
) {
	this.push(...items)
	assert.strictEqual(this.get(), expected)
})

class SourceBuilderTest extends MutableClassTest<SourceBuilder> {
	freeze() {
		this.testMethod("freeze")
	}

	unfreeze() {
		this.testMethod("unfreeze")
	}

	isFrozen(expected: boolean) {
		this.testMethod("isFrozen", expected)
	}

	clear() {
		this.testMethod("clear")
	}

	copy() {
		this.testMethod("copy")
	}

	get(expected: string) {
		this.testMethod("get", expected)
	}

	push(items: string[], expected: string) {
		this.testMethod("push", items, expected)
	}

	constructor() {
		super(
			[ClearableInterface, AccumulatorInterface],
			[isFrozen, freeze, unfreeze, clear, copy, get, push]
		)
	}
}

export const sourceBuilderTest = new SourceBuilderTest()
