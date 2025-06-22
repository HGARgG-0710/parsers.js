import { array, functional, object, type } from "@hgargg-0710/one"
import assert from "assert"
import { MultiIndex } from "../../../dist/src/internal/MultiIndex.js"
import { MethodTest, MutableClassTest } from "../lib.js"

const { structCheck } = object
const { isNumber, isFunction, isUndefined } = type
const { or } = functional

const MultiIndexInterface = {
	interfaceName: "MultiIndex",
	conformance: structCheck({
		levels: isNumber,
		get: isFunction,
		last: or(isNumber, isUndefined),
		slice: isFunction,
		copy: isFunction,
		nextLevel: isFunction,
		prevLevel: isFunction,
		resize: isFunction,
		clear: isFunction,
		incLast: isFunction,
		decLast: isFunction,
		extend: isFunction,
		from: isFunction
	})
}

function basicGetTest(tested: MultiIndex, sameAs: Iterable<number>) {
	assert(array.same(tested.get(), sameAs))
}

function basicSliceTest(
	sliced: MultiIndex,
	from: number,
	to: number,
	sameAs: Iterable<number>
) {
	assert(array.same(sliced.slice(from, to), sameAs))
}

function basicResizeTest(
	tested: MultiIndex,
	toLength: number,
	sameAs: Iterable<number>
) {
	assert(toLength >= 0)
	tested.resize(toLength)
	assert(array.same(tested.get(), sameAs))
}

const levels = new MethodTest("levels", function (
	this: MultiIndex,
	expected: number
) {
	assert.strictEqual(this.levels, expected)
})

const get = new MethodTest("get", function (
	this: MultiIndex,
	sameAs: Iterable<number>
) {
	basicGetTest(this, sameAs)
})

const last = new MethodTest("last", function (
	this: MultiIndex,
	expected: number
) {
	assert.strictEqual(this.last, expected)
})

// * `from, to === MissingArgument`
const sliceWhole = new MethodTest("sliceWhole", function (
	this: MultiIndex,
	sameAs: Iterable<number>
) {
	assert(array.same(this.slice(), sameAs))
})

// * `to === MissingArgument`
const sliceEnd = new MethodTest("sliceEnd", function (
	this: MultiIndex,
	from: number,
	sameAs: Iterable<number>
) {
	assert(array.same(this.slice(from), sameAs))
})

// * `to !== MissingArgument, to < 0`
const sliceToNegative = new MethodTest("sliceToNegative", function (
	this: MultiIndex,
	from: number,
	to: number,
	sameAs: Iterable<number>
) {
	assert(to < 0)
	basicSliceTest(this, from, to, sameAs)
})

// * `to !== MissingArgument, to >= 0`
const sliceToPositive = new MethodTest("sliceToPositive", function (
	this: MultiIndex,
	from: number,
	to: number,
	sameAs: Iterable<number>
) {
	assert(to > 0)
	basicSliceTest(this, from, to, sameAs)
})

const copy = new MethodTest("copy", function (this: MultiIndex) {
	const copied = this.copy()
	assert.notStrictEqual(this.get(), copied.get())
	basicGetTest(this, copied.get())
})

const nextLevel = new MethodTest("nextLevel", function (this: MultiIndex) {
	assert.notStrictEqual(this.last, 0)
	const oldLevels = this.levels
	this.nextLevel()
	assert.strictEqual(this.levels, oldLevels + 1)
	assert.strictEqual(this.last, 0)
})

const prevLevel = new MethodTest("prevLevel", function (
	this: MultiIndex,
	sameAs: Iterable<number>
) {
	this.prevLevel()
	basicGetTest(this, sameAs)
})

const resizeLesser = new MethodTest("resizeLesser", function (
	this: MultiIndex,
	toLength: number,
	sameAs: Iterable<number>
) {
	assert(toLength < this.levels)
	basicResizeTest(this, toLength, sameAs)
})

const resizeGreaterOrEqual = new MethodTest("resizeGreaterOrEqual", function (
	this: MultiIndex,
	toLength: number,
	sameAs: Iterable<number>
) {
	assert(toLength >= this.levels)
	basicResizeTest(this, toLength, sameAs)
})

const clear = new MethodTest("clear", function (this: MultiIndex) {
	this.clear()
	assert.strictEqual(this.levels, 0)
})

const incLast = new MethodTest("incLast", function (this: MultiIndex) {
	assert(!isUndefined(this.last))
	const oldLast = this.last
	this.incLast()
	assert.strictEqual(this.last, oldLast + 1)
})

const decLast = new MethodTest("decLast", function (this: MultiIndex) {
	assert(!isUndefined(this.last))
	const oldLast = this.last
	this.decLast()
	assert.strictEqual(this.last, oldLast - 1)
})

const extend = new MethodTest("extend", function (
	this: MultiIndex,
	withSubIndex: number[],
	sameAs: number[]
) {
	this.extend(withSubIndex)
	basicGetTest(this, sameAs)
})

const from = new MethodTest("from", function (
	this: MultiIndex,
	index: number[]
) {
	this.from(index)
	basicGetTest(this, index)
})

class MultiIndexTest extends MutableClassTest<MultiIndex> {
	levels(expected: number) {
		this.testMethod("levels", expected)
	}

	get(sameAs: Iterable<number>) {
		this.testMethod("get", sameAs)
	}

	last(expected: number) {
		this.testMethod("last", expected)
	}

	sliceWhole(sameAs: Iterable<number>) {
		this.testMethod("sliceWhole", sameAs)
	}

	sliceEnd(from: number, sameAs: Iterable<number>) {
		this.testMethod("sliceEnd", from, sameAs)
	}

	sliceToNegative(from: number, to: number, sameAs: Iterable<number>) {
		this.testMethod("sliceToNegative", from, to, sameAs)
	}

	sliceToPositive(from: number, to: number, sameAs: Iterable<number>) {
		this.testMethod("sliceToPositive", from, to, sameAs)
	}

	copy() {
		this.testMethod("copy")
	}

	nextLevel() {
		this.testMethod("nextLevel")
	}

	prevLevel(sameAs: Iterable<number>) {
		this.testMethod("prevLevel", sameAs)
	}

	resizeLesser(toLength: number, sameAs: Iterable<number>) {
		this.testMethod("resizeLesser", toLength, sameAs)
	}

	resizeGreaterOrEqual(toLength: number, sameAs: Iterable<number>) {
		this.testMethod("resizeGreaterOrEqual", toLength, sameAs)
	}

	clear() {
		this.testMethod("clear")
	}

	incLast() {
		this.testMethod("incLast")
	}

	decLast() {
		this.testMethod("decLast")
	}

	extend(withSubIndex: number[], sameAs: number[]) {
		this.testMethod("extend", withSubIndex, sameAs)
	}

	from(index: number[]) {
		this.testMethod("from", index)
	}

	constructor() {
		super(
			[MultiIndexInterface],
			[
				levels,
				get,
				last,
				sliceWhole,
				sliceEnd,
				sliceToPositive,
				sliceToNegative,
				copy,
				nextLevel,
				prevLevel,
				resizeGreaterOrEqual,
				resizeLesser,
				clear,
				incLast,
				decLast,
				extend,
				from
			]
		)
	}
}

export const multiIndexTest = new MultiIndexTest()
