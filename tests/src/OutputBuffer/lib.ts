import { array, object, type } from "@hgargg-0710/one"
import assert from "assert"
import type { IIndexed } from "../../../dist/src/interfaces.js"
import type { OutputBuffer } from "../../../dist/src/internal/OutputBuffer.js"
import { assertDistinct } from "../Copiable/lib.js"
import { freeze, isFrozen, unfreeze } from "../Freezable/lib.js"
import { MethodTest, MutableClassTest } from "../lib.js"
import { readWhole } from "../ParseableInput/lib.js"
import { read } from "../Readable/lib.js"
import { sameSizeTest, size, sizeTest, sizeUnchanged } from "../Sizeable/lib.js"

const { structCheck } = object
const { isFunction, isNumber, isBoolean } = type

export enum TestTypes {
	UNFROZEN = 0,
	FROZEN = 1
}

const PersistentAccumulatorInterface = {
	interfaceName: "IPersistentAccumulator",
	conformance: structCheck({
		copy: isFunction,
		freeze: isFunction,
		unfreeze: isFunction,
		push: isFunction,
		get: isFunction,
		read: isFunction,
		size: isNumber,
		isFrozen: isBoolean
	})
}

function assertOldItemsUnchanged<T = any>(
	instance: OutputBuffer<T>,
	oldSize: number,
	oldItems: T[]
) {
	read.withInstance(instance, 0, oldSize, oldItems)
}

const get = new MethodTest("get", function <T = any>(
	this: OutputBuffer<T>,
	expected: Iterable<T>
) {
	assert(array.same(this.get(), expected))
})

const pushUnfrozen = new MethodTest("pushUnfrozen", function <T = any>(
	this: OutputBuffer<T>,
	items: T[]
) {
	assert(!this.isFrozen)

	const oldSize = this.size
	const newSize = oldSize + items.length
	const oldItems = readWhole(this)

	this.push(...items)

	sizeTest(this, newSize)
	assertOldItemsUnchanged(this, oldSize, oldItems)
	read.withInstance(this, oldSize, newSize, items)
})

const pushFrozen = new MethodTest("pushFrozen", function <T = any>(
	this: OutputBuffer<T>,
	items: T[]
) {
	assert(this.isFrozen)
	sizeUnchanged(this, (tested: OutputBuffer<T>, oldSize) => {
		const oldItems = readWhole(tested)
		this.push(...items)
		assertOldItemsUnchanged(tested, oldSize, oldItems)
	})
})

const copy = new MethodTest("copy", function <T = any>(this: OutputBuffer<T>) {
	const copied = this.copy()
	sameSizeTest(this, copied)
	assert.strictEqual(this.isFrozen, copied.isFrozen)
	read.withInstance(this, 0, this.size, copied.get())
	assertDistinct(this, copied)
})

class OutputBufferTest<T = any> extends MutableClassTest<OutputBuffer<T>> {
	freeze() {
		this.testMethod("freeze")
	}

	unfreeze() {
		this.testMethod("unfreeze")
	}

	isFrozen(expected: boolean) {
		this.testMethod("isFrozen", expected)
	}

	size(expected: number) {
		this.testMethod("size", expected)
	}

	get(expected: Iterable<T>) {
		this.testMethod("get", expected)
	}

	read(from: number, to: number, expected: IIndexed<T>) {
		this.testMethod("read", from, to, expected)
	}

	pushUnfrozen(items: T[]) {
		this.testMethod("pushUnfrozen", items)
	}

	pushFrozen(items: T[]) {
		this.testMethod("pushFrozen", items)
	}

	copy() {
		this.testMethod("copy")
	}

	constructor() {
		super(
			[PersistentAccumulatorInterface],
			[
				read,
				size,
				isFrozen,
				freeze,
				unfreeze,
				get,
				pushUnfrozen,
				copy,
				pushFrozen
			]
		)
	}
}

export function outputBufferTest<T = any>() {
	return new OutputBufferTest<T>()
}
