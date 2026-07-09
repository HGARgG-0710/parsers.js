import assert from "assert";
import type { ILineIndex } from "../../../../dist/src/interfaces.js";
import {
	LineLengths,
	StringLineIndex,
} from "../../../dist/src/classes/Position.js";
import { assertDistinct } from "../../interfaces/Copiable/lib.js";
import { MethodTest } from "../../lib.js";
import {
	charAssert,
	lineAssert,
	LineIndexTest,
	nextLine,
	nextLineStartAssert,
	copy as superCopy,
} from "../LineIndex/lib.js";

const valueOf = new MethodTest("valueOf", function (
	this: StringLineIndex,
	expected: number,
) {
	assert.strictEqual(this.valueOf(), expected);
});

const copy = new MethodTest("copy", function (
	this: StringLineIndex,
	firstExcess: ILineIndex,
) {
	superCopy.withInstance(this);
	const copied = this.copy();
	fromInvalid.withInstance(this, firstExcess);
	fromInvalid.withInstance(copied, firstExcess);
	assertDistinct(this, copied);
});

const nextLineTip = new MethodTest("nextLineTip", function (
	this: StringLineIndex,
	firstExcess: ILineIndex,
) {
	fromInvalid.withInstance(this, firstExcess);
	nextLine.withInstance(this);
	from.withInstance(this, firstExcess);
});

const fromInvalid = new MethodTest("fromInvalid", function (
	this: StringLineIndex,
	lineIndex: ILineIndex,
) {
	const origLine = this.line;
	const origChar = this.char;

	let isValid = false;

	try {
		this.from(lineIndex);
		isValid = true;
	} catch {
		lineAssert(this, origLine);
		charAssert(this, origChar);
	}

	assert(!isValid);
});

const from = new MethodTest("from", function (
	this: StringLineIndex,
	lineIndex: ILineIndex,
) {
	this.from(lineIndex);
	lineAssert(this, lineIndex.line);
	charAssert(this, lineIndex.char);
});

const nextCharEdge = new MethodTest("nextCharEdge", function (
	this: StringLineIndex,
	lengths: LineLengths,
) {
	assert(!lengths.isNew(this.line));
	assert(!lengths.isAcceptable(this.line, this.char + 1));
	const origLine = this.line;
	this.nextChar();
	nextLineStartAssert(this, origLine);
});

class StringLineIndexTest extends LineIndexTest {
	valueOf(expected: number) {
		this.testMethod("valueOf", expected);
	}

	from(lineIndex: ILineIndex) {
		this.testMethod("from", lineIndex);
	}

	fromInvalid(lineIndex: ILineIndex) {
		this.testMethod("fromInvalid", lineIndex);
	}

	copy(firstExcess: ILineIndex) {
		this.testMethod("copy", firstExcess);
	}

	nextLineTip(firstExcess: ILineIndex) {
		this.testMethod("nextLineTip", firstExcess);
	}

	nextCharEdge(lengths: LineLengths) {
		this.testMethod("nextCharEdge", lengths);
	}

	constructor() {
		super([
			valueOf,
			fromInvalid,
			from,
			copy,
			nextLineTip,
			nextCharEdge,
		]);
	}
}

export const stringLineIndexTest = new StringLineIndexTest();
