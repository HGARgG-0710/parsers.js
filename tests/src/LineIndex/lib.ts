import { object, type } from "@hgargg-0710/one"
import assert from "assert"
import { LineIndex } from "../../../dist/src/classes/Position.js"
import type { ILineIndex } from "../../../dist/src/interfaces.js"
import { ClassTest, MethodTest } from "../lib.js"

const { structCheck } = object
const { isFunction, isNumber } = type

const LineIndexInterface = {
	interfaceName: "LineIndex",
	conformance: structCheck({
		copy: isFunction,
		char: isNumber,
		line: isNumber,
		nextChar: isFunction,
		nextLine: isFunction
	})
}

const char = new MethodTest("char", function (
	this: ILineIndex,
	expected: number
) {
	assert.strictEqual(this.char, expected)
})

const line = new MethodTest("line", function (
	this: ILineIndex,
	expected: number
) {
	assert.strictEqual(this.line, expected)
})

const nextChar = new MethodTest("nextChar", function (this: ILineIndex) {
	const origChar = this.char
	this.nextChar()
	assert.strictEqual(this.char, origChar + 1)
})

const nextLine = new MethodTest("nextLine", function (this: ILineIndex) {
	const origLine = this.line
	this.nextLine()
	assert.strictEqual(this.char, 0)
	assert.strictEqual(this.line, origLine + 1)
})

const copy = new MethodTest("copy", function (this: ILineIndex) {
	const copied = this.copy()
	assert.strictEqual(copied.char, this.char)
	assert.strictEqual(copied.line, this.line)
})

class LineIndexTest extends ClassTest<LineIndex> {
	line(expected: number) {
		this.testMethod("line", expected)
	}

	char(expected: number) {
		this.testMethod("char", expected)
	}

	nextChar() {
		this.testMethod("nextChar")
	}

	nextLine() {
		this.testMethod("nextLine")
	}

	copy() {
		this.testMethod("copy")
	}

	constructor() {
		super([LineIndexInterface], [char, line, nextChar, nextLine, copy])
	}
}

export const lineIndexTest = new LineIndexTest()
