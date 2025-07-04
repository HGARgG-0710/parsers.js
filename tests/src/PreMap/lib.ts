import { boolean, object, type } from "@hgargg-0710/one"
import assert from "assert"
import type { IIndexed, IPreMap } from "../../../dist/src/interfaces.js"
import { ClassTest, MethodTest, type Interface } from "../lib.js"
import { size } from "../Sizeable/lib.js"

const { T } = boolean
const { structCheck } = object
const { isFunction, isNumber } = type

function baseGetTest<K = any, V = any, Default = any>(
	tested: IPreMap<K, V, Default>,
	at: K,
	expected: V | Default
) {
	assert.strictEqual(tested.get(at), expected)
}

function nonExistenceCheck<K = any, V = any, Default = any>(
	tested: IPreMap<K, V, Default>,
	key: K
) {
	baseGetTest(tested, key, tested.default)
}

function keyExistenceCheck<K = any, V = any, Default = any>(
	tested: IPreMap<K, V, Default>,
	key: K
) {
	assert.notStrictEqual(tested.get(key), tested.default)
}

const PreMapInterface = {
	interfaceName: "IPreMap",
	conformance: structCheck({
		set: isFunction,
		delete: isFunction,
		rekey: isFunction,
		size: isNumber,
		default: T,
		copy: isFunction
	})
}

const _delete = new MethodTest("delete", function <
	K = any,
	V = any,
	Default = any
>(this: IPreMap<K, V, Default>, key: K) {
	keyExistenceCheck(this, key)
	this.delete(key)
	nonExistenceCheck(this, key)
})

const deleteNonExistent = new MethodTest("deleteNonExistent", function <
	K = any,
	V = any,
	Default = any
>(this: IPreMap<K, V, Default>, key: K) {
	nonExistenceCheck(this, key)
	this.delete(key)
	nonExistenceCheck(this, key)
})

const rekeyToUndefined = new MethodTest("rekeyToUndefined", function <
	K = any,
	V = any,
	Default = any
>(this: IPreMap<K, V, Default>, from: K, to: K) {
	const oldFrom = this.get(from)
	const oldTo = this.get(to)

	assert.strictEqual(oldTo, this.default)
	assert.notStrictEqual(oldFrom, this.default)

	this.rekey(from, to)
	assert.strictEqual(oldFrom, this.get(to))
	nonExistenceCheck(this, from)
})

const rekey = new MethodTest("rekey", function <
	K = any,
	V = any,
	Default = any
>(this: IPreMap<K, V, Default>, from: K, to: K) {
	const oldFrom = this.get(from)
	const oldTo = this.get(to)

	assert.notStrictEqual(oldTo, this.default)
	assert.notStrictEqual(oldFrom, this.default)
	assert.notStrictEqual(from, to)

	this.rekey(from, to)
	assert.strictEqual(oldFrom, this.get(to))
	nonExistenceCheck(this, from)
})

const rekeySame = new MethodTest("rekeySame", function <
	K = any,
	V = any,
	Default = any
>(this: IPreMap<K, V, Default>, key: K) {
	const oldFrom = this.get(key)
	this.rekey(key, key)
	assert.strictEqual(oldFrom, this.get(key))
})

const _default = new MethodTest("default", function <
	K = any,
	V = any,
	Default = any
>(this: IPreMap<K, V, Default>, expected: Default) {
	assert.strictEqual(this.default, expected)
})

const get = new MethodTest("get", function <K = any, V = any, Default = any>(
	this: IPreMap<K, V, Default>,
	at: K,
	expected: V
) {
	assert.notStrictEqual(expected, this.default)
	baseGetTest(this, at, expected)
})

const getDefault = new MethodTest("getDefault", function <
	K = any,
	V = any,
	Default = any
>(this: IPreMap<K, V, Default>, at: K) {
	nonExistenceCheck(this, at)
})

const set = new MethodTest("set", function <K = any, V = any, Default = any>(
	this: IPreMap<K, V, Default>,
	key: K,
	value: V
) {
	keyExistenceCheck(this, key)
	this.set(key, value)
	baseGetTest(this, key, value)
})

const setNonExistent = new MethodTest("setNonExistent", function <
	K = any,
	V = any,
	Default = any
>(this: IPreMap<K, V, Default>, key: K, value: V) {
	nonExistenceCheck(this, key)
	this.set(key, value)
	baseGetTest(this, key, value)
})

const copy = new MethodTest("copy", function <K = any, V = any, Default = any>(
	this: IPreMap<K, V, Default>,
	keys: IIndexed<K>
) {
	const copied = this.copy()
	assert.strictEqual(keys.length, this.size)
	assert.strictEqual(this.size, copied.size)
	for (const key of keys) assert.strictEqual(this.get(key), copied.get(key))
})

export abstract class PreMapTest<
	K = any,
	V = any,
	Default = any
> extends ClassTest<IPreMap<K, V, Default>> {
	default(expected: Default) {
		this.testMethod("default", expected)
	}

	get(at: K, expected: V) {
		this.testMethod("get", at, expected)
	}

	getDefault(at: K) {
		this.testMethod("getDefault", at)
	}

	set(key: K, value: V) {
		this.testMethod("set", key, value)
	}

	setNonExistent(key: K, value: V) {
		this.testMethod("setNonExistent", key, value)
	}

	delete(key: K) {
		this.testMethod("delete", key)
	}

	deleteNonExistent(key: K) {
		this.testMethod("deleteNonExistent", key)
	}

	rekeyToUndefined(from: K, to: K) {
		this.testMethod("rekeyToUndefined", from, to)
	}

	rekey(from: K, to: K) {
		this.testMethod("rekey", from, to)
	}

	rekeySame(key: K) {
		this.testMethod("rekeySame", key)
	}

	size(expected: number) {
		this.testMethod("size", expected)
	}

	copy(keys: IIndexed<string>) {
		this.testMethod("copy", keys)
	}

	constructor(interfaces: Interface[] = [], methods: MethodTest[] = []) {
		super(
			[PreMapInterface, ...interfaces],
			[
				_default,
				size,
				get,
				getDefault,
				set,
				setNonExistent,
				_delete,
				deleteNonExistent,
				rekeyToUndefined,
				rekey,
				rekeySame,
				copy,
				...methods
			]
		)
	}
}
