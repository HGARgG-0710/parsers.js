import { array, object, type } from "@hgargg-0710/one"
import assert from "assert"
import type { IPlainMap } from "../../../dist/src/interfaces.js"
import { assertDistinct } from "../Copiable/lib.js"
import { MethodTest, MutableClassTest } from "../lib.js"

const { structCheck } = object
const { isFunction } = type

const PlainMapInterface = {
	interfaceName: "IPlainMap",
	conformance: structCheck({
		annul: isFunction,
		values: isFunction,
		write: isFunction,
		read: isFunction,
		copy: isFunction
	})
}

function baseReadCheck<K = any, V = any>(
	tested: IPlainMap<K, V>,
	key: K,
	expected: V | undefined
) {
	assert.strictEqual(tested.read(key), expected)
}

const read = new MethodTest("read", function <K = any, V = any>(
	this: IPlainMap<K, V>,
	key: K,
	expected: V | undefined
) {
	baseReadCheck(this, key, expected)
})

const write = new MethodTest("write", function <K = any, V = any>(
	this: IPlainMap<K, V>,
	key: K,
	value: V
) {
	this.write(key, value)
	baseReadCheck(this, key, value)
})

const annul = new MethodTest("annul", function <K = any, V = any>(
	this: IPlainMap<K, V>,
	key: K
) {
	this.annul(key)
	baseReadCheck(this, key, undefined)
})

const values = new MethodTest("values", function <K = any, V = any>(
	this: IPlainMap<K, V>,
	sameAs: Iterable<V | undefined>
) {
	assert(array.same(this.values(), sameAs))
})

const copy = new MethodTest("copy", function <K = any, V = any>(
	this: IPlainMap<K, V>,
	keys: Iterable<K>
) {
	const copied = this.copy()
	for (const key of keys) assert.strictEqual(this.read(key), copied.read(key))
	assertDistinct(this, copied)
})

class PlainMapTest<K = any, V = any> extends MutableClassTest<IPlainMap<K, V>> {
	read(key: K, expected: V | undefined) {
		this.testMethod("read", key, expected)
	}

	write(key: K, value: V) {
		this.testMethod("write", key, value)
	}

	annul(key: K) {
		this.testMethod("annul", key)
	}

	values(sameAs: Iterable<V | undefined>) {
		this.testMethod("values", sameAs)
	}

	copy(keys: Iterable<K>) {
		this.testMethod("copy", keys)
	}

	constructor() {
		super([PlainMapInterface], [read, write, annul, values, copy])
	}
}

export function plainMapTest<K = any, V = any>() {
	return new PlainMapTest<K, V>()
}
