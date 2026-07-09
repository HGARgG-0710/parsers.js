import { array } from "@hgargg-0710/one"
import assert from "assert"
import { LineLengths } from "../../../dist/src/classes/Position.js"
import { ClassTest, MethodTest } from "../../lib.js"
import { assertDistinct } from "../interfaces/Copiable/lib.js"

const get = new MethodTest(
	"get",
	function (this: LineLengths, at: number, expected: number) {
		assert.strictEqual(this.get(at), expected)
	}
)

const copy = new MethodTest(
	"copy",
	function (this: LineLengths, lastIndex: number) {
		assert(this.isNew(lastIndex + 1))
		const copied = this.copy()
		const oldLast = this.get(lastIndex)
		this.updateNext(oldLast + 1)
		this.confirmNext()
		assert(this.isKnown(lastIndex))
		assert(!copied.isKnown(lastIndex + 1))
		assertDistinct(this, copied)
	}
)

const slice = new MethodTest(
	"slice",
	function (this: LineLengths, to: number, sameAs: Iterable<number>) {
		assert(array.same(this.slice(to), sameAs))
	}
)

const isExcess = new MethodTest(
	"isExcess",
	function (this: LineLengths, index: number, expected: boolean) {
		assert.strictEqual(this.isExcess(index), expected)
	}
)

const isNew = new MethodTest(
	"isNew",
	function (this: LineLengths, index: number, expected: boolean) {
		assert.strictEqual(this.isNew(index), expected)
	}
)

const isKnown = new MethodTest(
	"isKnown",
	function (this: LineLengths, index: number, expected: boolean) {
		assert.strictEqual(this.isKnown(index), expected)
	}
)

const isAcceptable = new MethodTest(
	"isAcceptable",
	function (
		this: LineLengths,
		atIndex: number,
		char: number,
		expected: boolean
	) {
		assert.strictEqual(this.isAcceptable(atIndex, char), expected)
	}
)

class LineLengthsTest extends ClassTest<LineLengths> {
	copy(lastIndex: number) {
		this.testMethod("copy", lastIndex)
	}

	slice(to: number, sameAs: Iterable<number>) {
		this.testMethod("slice", to, sameAs)
	}

	get(at: number, expected: number) {
		this.testMethod("get", at, expected)
	}

	isExcess(index: number, expected: boolean) {
		this.testMethod("isExcess", index, expected)
	}

	isNew(index: number, expected: boolean) {
		this.testMethod("isNew", index, expected)
	}

	isKnown(index: number, expected: boolean) {
		this.testMethod("isKnown", index, expected)
	}

	isAcceptable(atIndex: number, char: number, expected: boolean) {
		this.testMethod("isAcceptable", atIndex, char, expected)
	}

	constructor() {
		super([copy, get, slice, isExcess, isNew, isKnown, isAcceptable])
	}
}

export const lineLengthsTest = new LineLengthsTest()
