import { array, object, type } from "@hgargg-0710/one"
import type { Summat } from "@hgargg-0710/summat.ts"
import assert from "assert"
import { PropDigger } from "../../../dist/src/classes.js"
import type { IPredicatePosition } from "../../../dist/src/interfaces.js"
import { MethodTest, MutableClassTest } from "../lib.js"

const { structCheck } = object
const { isFunction, isArray, isNumber } = type

const PropDiggerInterface = {
	interfaceName: "PropDigger",
	conformance: structCheck({
		copy: isFunction,
		with: isFunction,
		dig: isFunction,
		properties: isArray
	})
}

const _with = new MethodTest("with", function (
	this: PropDigger,
	withProps: string[]
) {
	assert(
		array.same(
			this.with(...withProps).properties,
			this.properties.concat(withProps)
		)
	)
})

const copy = new MethodTest("copy", function (this: PropDigger) {
	assert(array.same(this.copy().properties, this.properties))
	assert.notStrictEqual(this, this.copy())
})

const digFinite = new MethodTest("digFinite", function <
	In extends Summat = object,
	Out = any
>(this: PropDigger, toDig: In, count: number, expected: Out) {
	assert(isNumber(count))
	assert.strictEqual(this.dig(toDig, count), expected)
})

const digPredicate = new MethodTest("digPredicate", function <
	In extends Summat = object,
	Out = any
>(
	this: PropDigger,
	toDig: In,
	predicate: IPredicatePosition<In>,
	expected: Out
) {
	assert(isFunction(predicate))
	assert.strictEqual(this.dig(toDig, predicate), expected)
})

const properties = new MethodTest("properties", function (
	this: PropDigger,
	expected: string[]
) {
	assert(array.same(this.properties, expected))
})

class PropDiggerTest extends MutableClassTest<PropDigger> {
	with(withProps: string[]) {
		this.testMethod("with", withProps)
	}

	copy() {
		this.testMethod("copy")
	}

	digFinite<In extends Summat, Out = any>(
		toDig: In,
		count: number,
		expected: Out
	) {
		this.testMethod("digFinite", toDig, count, expected)
	}

	digPredicate<In extends Summat = object, Out = any>(
		toDig: In,
		predicate: IPredicatePosition<In>,
		expected: Out
	) {
		this.testMethod("digPredicate", toDig, predicate, expected)
	}

	properties(expected: string[]) {
		this.testMethod("properties", expected)
	}

	constructor() {
		super(
			[PropDiggerInterface],
			[_with, copy, digFinite, digPredicate, properties]
		)
	}
}

export const propDiggerTest = new PropDiggerTest()
