import { object, type } from "@hgargg-0710/one"
import assert from "assert"
import { BackupIndex, LineLengths } from "../../../dist/src/classes/Position.js"
import type { ILineIndex } from "../../../dist/src/interfaces.js"
import { assertDistinct } from "../Copiable/lib.js"
import {
	charAssert,
	lineAssert,
	LineIndexTest,
	lineStartAssert,
	nextLine,
	nextLineStartAssert,
	copy as superCopy
} from "../LineIndex/lib.js"
import { MethodTest } from "../lib.js"

const { structCheck } = object
const { isFunction } = type

const BackupIndexInterface = {
	interfaceName: "BackupIndex",
	conformance: structCheck({
		prevChar: isFunction,
		toNumber: isFunction,
		from: isFunction,
		init: isFunction
	})
}

function prevCharAssert(instance: ILineIndex, origChar: number) {
	charAssert(instance, origChar - 1)
}

const toNumber = new MethodTest("toNumber", function (
	this: BackupIndex,
	expected: number
) {
	assert.strictEqual(this.toNumber(), expected)
})

const prevCharDefault = new MethodTest("prevCharDefault", function (
	this: BackupIndex
) {
	assert(this.char > 0)
	const origLine = this.line
	const origChar = this.char
	this.prevChar()
	lineAssert(this, origLine)
	prevCharAssert(this, origChar)
})

const prevCharStart = new MethodTest("prevCharStart", function (
	this: BackupIndex,
	line: number,
	char: number
) {
	lineStartAssert(this)
	this.prevChar()
	lineAssert(this, line)
	charAssert(this, char)
})

const copy = new MethodTest("copy", function (
	this: BackupIndex,
	firstExcess: ILineIndex
) {
	superCopy.withInstance(this)
	const copied = this.copy()
	fromInvalid.withInstance(this, firstExcess)
	fromInvalid.withInstance(copied, firstExcess)
	assertDistinct(this, copied)
})

const nextLineTip = new MethodTest("nextLineTip", function (
	this: BackupIndex,
	firstExcess: ILineIndex
) {
	fromInvalid.withInstance(this, firstExcess)
	nextLine.withInstance(this)
	from.withInstance(this, firstExcess)
})

const fromInvalid = new MethodTest("fromInvalid", function (
	this: BackupIndex,
	lineIndex: ILineIndex
) {
	const origLine = this.line
	const origChar = this.char

	let isValid = false

	try {
		this.from(lineIndex)
		isValid = true
	} catch {
		lineAssert(this, origLine)
		charAssert(this, origChar)
	}

	assert(!isValid)
})

const from = new MethodTest("from", function (
	this: BackupIndex,
	lineIndex: ILineIndex
) {
	this.from(lineIndex)
	lineAssert(this, lineIndex.line)
	charAssert(this, lineIndex.char)
})

const nextCharEdge = new MethodTest("nextCharEdge", function (
	this: BackupIndex,
	lengths: LineLengths
) {
	assert(!lengths.isNew(this.line))
	assert(!lengths.isAcceptable(this.line, this.char + 1))
	const origLine = this.line
	this.nextChar()
	nextLineStartAssert(this, origLine)
})

class BackupIndexTest extends LineIndexTest {
	prevCharDefault() {
		this.testMethod("prevCharDefault")
	}

	prevCharStart(line: number, char: number) {
		this.testMethod("prevCharStart", line, char)
	}

	toNumber(expected: number) {
		this.testMethod("toNumber", expected)
	}

	from(lineIndex: ILineIndex) {
		this.testMethod("from", lineIndex)
	}

	fromInvalid(lineIndex: ILineIndex) {
		this.testMethod("fromInvalid", lineIndex)
	}

	copy(firstExcess: ILineIndex) {
		this.testMethod("copy", firstExcess)
	}

	nextLineTip(firstExcess: ILineIndex) {
		this.testMethod("nextLineTip", firstExcess)
	}

	nextCharEdge(lengths: LineLengths) {
		this.testMethod("nextCharEdge", lengths)
	}

	constructor() {
		super(
			[BackupIndexInterface],
			[
				prevCharDefault,
				prevCharStart,
				toNumber,
				fromInvalid,
				from,
				copy,
				nextLineTip,
				nextCharEdge
			]
		)
	}
}

export const backupIndexTest = new BackupIndexTest()
