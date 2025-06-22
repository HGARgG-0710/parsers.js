import { object, type } from "@hgargg-0710/one"
import assert from "assert"
import { MissingArgument } from "../../../dist/main.js"
import type { IIndexed, IReadable } from "../../../dist/src/interfaces.js"
import { ReadableView } from "../../../dist/src/internal/ReadableView.js"
import { MutableClassTest, MethodTest } from "../lib.js"
import { read } from "../Readable/lib.js"

const { structCheck } = object
const { isFunction } = type

export enum TestTypes {
	ZERO_OFFSET = 0,
	NON_ZERO_OFFSET = 1
}

const ViewInterface = {
	interfaceName: "IView",
	conformance: structCheck({
		read: isFunction,
		copy: isFunction,
		init: isFunction
	})
}

function baseReadTest<T = any>(
	readableView: ReadableView<T>,
	index: number,
	expected: T
) {
	assert.strictEqual(readableView.read(index), expected)
}

const initNonNull = new MethodTest("initNonNull", function <T = any>(
	this: ReadableView<T>,
	readable: IReadable<T>,
	shift: number,
	i: number
) {
	this.init(readable)
	baseReadTest(this, i, readable.read(i + shift))
})

const initNull = new MethodTest("initNull", function (
	readable: any,
	i: number
) {
	const origItem = this.read(i)
	assert.strictEqual(readable, MissingArgument)
	this.init(readable)
	baseReadTest(this, i, origItem)
})

const forward = new MethodTest("forward", function <T = any>(
	this: ReadableView<T>,
	count: number,
	index: number,
	expected: T
) {
	for (let i = 0; i < count; ++i) this.forward()
	baseReadTest(this, index, expected)
})

const backward = new MethodTest("backward", function <T = any>(
	this: ReadableView<T>,
	count: number,
	index: number,
	expected: T
) {
	for (let i = 0; i < count; ++i) this.backward()
	baseReadTest(this, index, expected)
})

class ReadableViewTest<T = any> extends MutableClassTest<ReadableView<T>> {
	read(from: number, to: number, expected: IIndexed<T>) {
		this.testMethod("read", from, to, expected)
	}

	initNonNull(readable: IReadable<T>, shift: number, i: number) {
		this.testMethod("initNonNull", readable, shift, i)
	}

	initNull(i: number) {
		this.testMethod("initNull", MissingArgument, i)
	}

	forward(count: number, index: number, expected: T) {
		this.testMethod("forward", count, index, expected)
	}

	backward(count: number, index: number, expected: T) {
		this.testMethod("backward", count, index, expected)
	}

	constructor() {
		super([ViewInterface], [read, initNull, initNonNull, forward, backward])
	}
}

export function readableViewTest<T = any>() {
	return new ReadableViewTest<T>()
}
