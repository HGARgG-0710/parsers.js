import { array, boolean, object, type } from "@hgargg-0710/one"
import assert from "assert"
import type { ITableCarrier } from "../../../dist/src/interfaces.js"
import { _default } from "../Defaulting/lib.js"
import { ImmutableClassTest, MethodTest } from "../lib.js"
import { sameSizeTest, size } from "../Sizeable/lib.js"

const { structCheck } = object
const { isNumber, isArray, isFunction } = type
const { T } = boolean

export function carrierCompare<K = any, V = any, Default = any>(
	c1: ITableCarrier<K, V, Default>,
	c2: ITableCarrier<K, V, Default>
) {
	assert.strictEqual(c1.default, c2.default)
	assert(array.same(c1.keys, c2.keys))
	assert(array.same(c1.values, c2.values))
	sameSizeTest(c1, c2)
}

const TableCarrierInterface = {
	interfaceName: "TableCarrier",
	conformance: structCheck({
		size: isNumber,
		default: T,
		keys: isArray,
		values: isArray,
		read: isFunction
	})
}

const keys = new MethodTest("keys", function <K = any, V = any, Default = any>(
	this: ITableCarrier<K, V, Default>,
	sameAs: Iterable<K>
) {
	assert(array.same(this.keys, sameAs))
})

const values = new MethodTest("values", function <
	K = any,
	V = any,
	Default = any
>(this: ITableCarrier<K, V, Default>, sameAs: Iterable<V>) {
	assert(array.same(this.values, sameAs))
})

const readKnown = new MethodTest("readKnown", function <
	K = any,
	V = any,
	Default = any
>(this: ITableCarrier<K, V, Default>, i: number, expected: V) {
	assert.strictEqual(this.read(i), expected)
})

const readUnknown = new MethodTest("readUnknown", function <
	K = any,
	V = any,
	Default = any
>(this: ITableCarrier<K, V, Default>, i: number) {
	assert.strictEqual(this.read(i), this.default)
})

class TableCarrierTest<
	K = any,
	V = any,
	Default = any
> extends ImmutableClassTest<ITableCarrier<K, V, Default>> {
	keys(sameAs: Iterable<K>) {
		this.testMethod("keys", sameAs)
	}

	values(sameAs: Iterable<V>) {
		this.testMethod("values", sameAs)
	}

	readKnown(i: number, expected: V) {
		this.testMethod("readKnown", i, expected)
	}

	readUnknown(i: number) {
		this.testMethod("readUnknown", i)
	}

	size(expected: number) {
		this.testMethod("size", expected)
	}

	default(expected: Default) {
		this.testMethod("default", expected)
	}

	constructor() {
		super(
			[TableCarrierInterface],
			[size, _default, keys, values, readKnown, readUnknown]
		)
	}
}

export function tableCarrierTest<K = any, V = any, Default = undefined>() {
	return new TableCarrierTest<K, V, Default>()
}
