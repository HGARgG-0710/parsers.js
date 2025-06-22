import { object, type } from "@hgargg-0710/one"
import assert from "assert"
import type { ILineIndex } from "../../../dist/src/interfaces.js"
import { MutableClassTest, MethodTest, type RuntimeInterface } from "../lib.js"

const { structCheck } = object
const { isFunction, isNumber } = type

function nextLineAssert(instance: ILineIndex, origLine: number) {
	lineAssert(instance, origLine + 1)
}

function nextCharAssert(instance: ILineIndex, origChar: number) {
	charAssert(instance, origChar + 1)
}

export function nextLineStartAssert(instance: ILineIndex, origLine: number) {
	lineStartAssert(instance)
	nextLineAssert(instance, origLine)
}

export function lineStartAssert(instance: ILineIndex) {
	charAssert(instance, 0)
}

export function charAssert(instance: ILineIndex, char: number) {
	assert.strictEqual(instance.char, char)
}

export function lineAssert(instance: ILineIndex, line: number) {
	assert.strictEqual(instance.line, line)
}

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
	charAssert(this, expected)
})

const line = new MethodTest("line", function (
	this: ILineIndex,
	expected: number
) {
	lineAssert(this, expected)
})

const nextChar = new MethodTest("nextChar", function (this: ILineIndex) {
	const origLine = this.line
	const origChar = this.char
	this.nextChar()
	lineAssert(this, origLine)
	nextCharAssert(this, origChar)
})

export const nextLine = new MethodTest("nextLine", function (this: ILineIndex) {
	const origLine = this.line
	this.nextLine()
	nextLineStartAssert(this, origLine)
})

export const copy = new MethodTest("copy", function (this: ILineIndex) {
	const copied = this.copy()
	charAssert(copied, this.char)
	lineAssert(copied, this.line)
	
	const oldChar = this.char
	this.nextChar()
	charAssert(copied, oldChar)
	assert.notStrictEqual(this.char, oldChar)
})

export class LineIndexTest extends MutableClassTest<ILineIndex> {
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

	copy(...args: any[]) {
		this.testMethod("copy")
	}

	constructor(interfaces: RuntimeInterface[] = [], methods: MethodTest[] = []) {
		super(
			[LineIndexInterface, ...interfaces],
			[...methods, char, line, nextChar, nextLine, copy]
		)
	}
}

export const lineIndexTest = new LineIndexTest()
