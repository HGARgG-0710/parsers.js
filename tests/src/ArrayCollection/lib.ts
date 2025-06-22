import { array, object, type } from "@hgargg-0710/one"
import assert from "assert"
import type { ArrayCollection } from "../../../dist/src/classes.js"
import type { IIndexed } from "../../../dist/src/interfaces.js"
import { assertDistinct } from "../Copiable/lib.js"
import { MethodTest, MutableClassTest } from "../lib.js"
import { read } from "../Readable/lib.js"
import { sameSizeTest, size, sizeTest } from "../Sizeable/lib.js"

const { structCheck } = object
const { isFunction, isNumber } = type

const ArrayCollectionInterface = {
	interfaceName: "ArrayCollection",
	conformance: structCheck({
		write: isFunction,
		push: isFunction,
		read: isFunction,
		size: isNumber,
		get: isFunction,
		[Symbol.iterator]: isFunction,
		init: isFunction,
		copy: isFunction
	})
}

function baseIteratorCheck<T = any>(
	tested: ArrayCollection<T>,
	sameAs: Iterable<T>
) {
	assert(array.same(tested, sameAs))
}

function iteratorsDifferentCheck<T = any>(
	tested: ArrayCollection<T>,
	sameAs: Iterable<T>
) {
	assert(!array.same(tested, sameAs))
}

const iterator = new MethodTest("Symbol.iterator", function <T = any>(
	this: ArrayCollection<T>,
	sameAs: Iterable<T>
) {
	baseIteratorCheck(this, sameAs)
})

const init = new MethodTest("init", function <T = any>(
	this: ArrayCollection<T>,
	withArr: T[]
) {
	iteratorsDifferentCheck(this, withArr)
	this.init(withArr)
	baseIteratorCheck(this, withArr)
})

const get = new MethodTest("get", function <T = any>(
	this: ArrayCollection<T>,
	sameAs: Iterable<T>
) {
	assert(array.same(this.get(), sameAs))
	assert(array.same(this, this.get()))
})

const write = new MethodTest("write", function <T = any>(
	this: ArrayCollection<T>,
	i: number,
	value: T
) {
	this.write(i, value)
	assert.strictEqual(this.read(i), value)
})

const push = new MethodTest("push", function <T = any>(
	this: ArrayCollection<T>,
	items: T[]
) {
	const prevSize = this.size
	const prev = [...this]

	this.push(...items)

	sizeTest(this, prevSize + items.length)

	for (let i = 0; i < prev.length; ++i)
		assert.strictEqual(prev[i], this.read(i))

	for (let i = 0; i < items.length; ++i)
		assert.strictEqual(this.read(prevSize + i), items[i])
})

const copy = new MethodTest("copy", function <T = any>(
	this: ArrayCollection<T>,
	newItem: T
) {
	const copied = this.copy()
	const prevCopied = [...copied]

	assert(array.same(this, copied))
	assertDistinct(this, copied)
	sameSizeTest(this, copied)

	this.push(newItem)

	sizeTest(this, copied.size + 1)
	assert(array.same(copied, prevCopied))
})

class ArrayCollectionTest<T = any> extends MutableClassTest<
	ArrayCollection<T>
> {
	iterator(sameAs: Iterable<T>) {
		this.testMethod("Symbol.iterator", sameAs)
	}

	init(withArr: T[]) {
		this.testMethod("init", withArr)
	}

	size(expected: number) {
		this.testMethod("size", expected)
	}

	get(sameAs: Iterable<T>) {
		this.testMethod("get", sameAs)
	}

	write(i: number, value: T) {
		this.testMethod("write", i, value)
	}

	read(from: number, to: number, expected: IIndexed<T>) {
		this.testMethod("read", from, to, expected)
	}

	push(items: T[]) {
		this.testMethod("push", items)
	}

	copy(newItem: T) {
		this.testMethod("copy", newItem)
	}

	constructor() {
		super(
			[ArrayCollectionInterface],
			[iterator, init, size, get, write, read, push, copy]
		)
	}
}

export function arrayCollectionTest<T = any>() {
	return new ArrayCollectionTest<T>()
}
