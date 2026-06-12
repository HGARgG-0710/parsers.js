import { array, object, type } from "@hgargg-0710/one"
import assert from "assert"
import type { TableColumn } from "../../../dist/src/classes.js"
import type { IIndexed } from "../../../dist/src/interfaces.js"
import { MethodTest, MutableClassTest } from "../lib.js"
import { read } from "../Readable/lib.js"
import { size, sizeTest, sizeUnchanged } from "../Sizeable/lib.js"

const { isNumber, isFunction } = type
const { structCheck } = object

const TableColumnInterface = {
	interfaceName: "TableColumn",
	conformance: structCheck({
		size: isNumber,
		set: isFunction,
		insert: isFunction,
		delete: isFunction,
		reverse: isFunction,
		swap: isFunction,
		read: isFunction,
		map: isFunction,
		push: isFunction,
		indexOf: isFunction,
		reset: isFunction,
		get: isFunction,
		copy: isFunction
	})
}

const get = new MethodTest("get", function <T = any>(
	this: TableColumn<T>,
	sameAs: Iterable<T>
) {
	assert(array.same(this.get(), sameAs))
	assert.strictEqual(this.get(), this.get())
})

const set = new MethodTest("set", function <T = any>(
	this: TableColumn<T>,
	i: number,
	value: T
) {
	assert(i < this.size)
	sizeUnchanged(this, (tested: TableColumn<T>) => {
		tested.set(i, value)
		assert.strictEqual(tested.read(i), value)
	})
})

const insert = new MethodTest("insert", function <T = any>(
	this: TableColumn<T>,
	i: number,
	value: T
) {
	const oldSize = this.size
	const oldCopy = array.copy(this.get() as T[])
	this.insert(i, value)

	assert.strictEqual(this.read(i), value)
	sizeTest(this, oldSize + 1)

	for (let j = 0; j < i; ++j) assert.strictEqual(this.read(j), oldCopy[j])

	for (let j = i + 1; j < this.size; ++j)
		assert.strictEqual(this.read(j), oldCopy[j - 1])
})

const reverse = new MethodTest("reverse", function <T = any>(
	this: TableColumn<T>,
	sameAs: Iterable<T>
) {
	this.reverse()
	assert(array.same(this.get(), sameAs))
})

const swap = new MethodTest("swap", function <T = any>(
	this: TableColumn<T>,
	i: number,
	j: number
) {
	const oldI = this.read(i)
	const oldJ = this.read(j)
	this.swap(i, j)
	assert.strictEqual(this.read(i), oldJ)
	assert.strictEqual(this.read(j), oldI)
})

const map = new MethodTest("map", function <T = any>(
	this: TableColumn<T>,
	indexes: readonly number[],
	sameAs: Iterable<T>
) {
	this.map(indexes)
	assert(array.same(this.get(), sameAs))
})

const push = new MethodTest("push", function <T = any>(
	this: TableColumn<T>,
	items: T[]
) {
	const prevSize = this.size
	const prev = this.get()

	this.push(...items)

	assert.strictEqual(this.size, prevSize + items.length)

	for (let i = 0; i < prev.length; ++i)
		assert.strictEqual(prev[i], this.read(i))

	for (let i = 0; i < items.length; ++i)
		assert.strictEqual(this.read(prevSize + i), items[i])
})

const indexOf = new MethodTest("indexOf", function <T = any>(
	this: TableColumn<T>,
	item: T,
	expected: number
) {
	assert.strictEqual(this.indexOf(item), expected)
})

const _delete = new MethodTest("delete", function <T = any>(
	this: TableColumn<T>,
	i: number,
	count: number = 1
) {
	const indexIncrease = Math.min(count, this.size - i)
	const oldSize = this.size
	const oldCopy = array.copy(this.get() as T[])
	this.delete(i, count)
	assert.strictEqual(this.size, oldSize - indexIncrease)
	for (let j = 0; j < i; ++j) assert.strictEqual(this.read(j), oldCopy[j])
	for (let j = i; j < this.size; ++j)
		assert.strictEqual(this.read(j), oldCopy[j + indexIncrease])
})

const reset = new MethodTest("reset", function <T = any>(
	this: TableColumn<T>,
	items: T[]
) {
	this.reset(items)
	assert.strictEqual(this.get(), items)
})

const copy = new MethodTest("copy", function <T = any>(this: TableColumn<T>) {
	const copied = this.copy()
	assert(array.same(this.get(), copied.get()))
	assert.notStrictEqual(this, copied)
	assert.notStrictEqual(this.get(), copied.get())
})

class TableColumnTest<T = any> extends MutableClassTest<TableColumn<T>> {
	size(expected: number) {
		this.testMethod("size", expected)
	}

	read(from: number, to: number, expected: IIndexed<T>) {
		this.testMethod("read", from, to, expected)
	}

	get(sameAs: Iterable<T>) {
		this.testMethod("get", sameAs)
	}

	set(i: number, value: T) {
		this.testMethod("set", i, value)
	}

	insert(i: number, value: T) {
		this.testMethod("insert", i, value)
	}

	reverse(sameAs: Iterable<T>) {
		this.testMethod("reverse", sameAs)
	}

	swap(i: number, j: number) {
		this.testMethod("swap", i, j)
	}

	map(indexes: readonly number[], sameAs: Iterable<T>) {
		this.testMethod("map", indexes, sameAs)
	}

	push(items: Iterable<T>) {
		this.testMethod("push", items)
	}

	indexOf(item: T, expected: number) {
		this.testMethod("indexOf", item, expected)
	}

	delete(i: number, count?: number) {
		this.testMethod("delete", i, count)
	}

	reset(items: T[]) {
		this.testMethod("reset", items)
	}

	copy() {
		this.testMethod("copy")
	}

	constructor() {
		super(
			[TableColumnInterface],
			[
				read,
				size,
				get,
				set,
				insert,
				reverse,
				swap,
				map,
				push,
				indexOf,
				_delete,
				reset,
				copy
			]
		)
	}
}

export function tableColumnTest<T = any>() {
	return new TableColumnTest<T>()
}
