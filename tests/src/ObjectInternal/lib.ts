import assert from "assert"
import type { IIndexed } from "../../../dist/src/interfaces.js"
import { ObjectInternal } from "../../../dist/src/modules/HashMap/classes/PreMap.js"
import { ClassTest, MethodTest } from "../lib.js"
import { PreMapInterface } from "../PreMap/lib.js"
import { size } from "../Sizeable/lib.js"

function baseGetTest<T = any, Default = any>(
	tested: ObjectInternal<T, Default>,
	at: string,
	expected: T | Default
) {
	assert.strictEqual(tested.get(at), expected)
}

function nonExistenceCheck<T = any, Default = any>(
	tested: ObjectInternal<T, Default>,
	key: string
) {
	baseGetTest(tested, key, tested.default)
}

function keyExistenceCheck<T = any, Default = any>(
	tested: ObjectInternal<T, Default>,
	key: string
) {
	assert.notStrictEqual(tested.get(key), tested.default)
}

const get = new MethodTest("get", function <T, Default>(
	this: ObjectInternal<T, Default>,
	at: string,
	expected: T
) {
	assert.notStrictEqual(expected, this.default)
	baseGetTest(this, at, expected)
})

const getDefault = new MethodTest("getDefault", function <
	T = any,
	Default = any
>(this: ObjectInternal<T, Default>, at: string) {
	nonExistenceCheck(this, at)
})

const set = new MethodTest("set", function <T = any, Default = any>(
	this: ObjectInternal<T, Default>,
	key: string,
	value: T
) {
	keyExistenceCheck(this, key)
	this.set(key, value)
	baseGetTest(this, key, value)
})

const setNonExistent = new MethodTest("setNonExistent", function <
	T = any,
	Default = any
>(this: ObjectInternal<T, Default>, key: string, value: T) {
	nonExistenceCheck(this, key)
	this.set(key, value)
	baseGetTest(this, key, value)
})

const _delete = new MethodTest("delete", function <T = any, Default = any>(
	this: ObjectInternal<T, Default>,
	key: string
) {
	keyExistenceCheck(this, key)
	this.delete(key)
	nonExistenceCheck(this, key)
})

const deleteNonExistent = new MethodTest("deleteNonExistent", function <
	T = any,
	Default = any
>(this: ObjectInternal<T, Default>, key: string) {
	nonExistenceCheck(this, key)
	this.delete(key)
	nonExistenceCheck(this, key)
})

const rekeyToUndefined = new MethodTest("rekeyToUndefined", function <
	T = any,
	Default = any
>(this: ObjectInternal<T, Default>, from: string, to: string) {
	const oldFrom = this.get(from)
	const oldTo = this.get(to)

	assert.strictEqual(oldTo, this.default)
	assert.notStrictEqual(oldFrom, this.default)

	this.rekey(from, to)
	assert.strictEqual(oldFrom, this.get(to))
	nonExistenceCheck(this, from)
})

const rekey = new MethodTest("rekey", function <T = any, Default = any>(
	this: ObjectInternal<T, Default>,
	from: string,
	to: string
) {
	const oldFrom = this.get(from)
	const oldTo = this.get(to)

	assert.notStrictEqual(oldTo, this.default)
	assert.notStrictEqual(oldFrom, this.default)
	assert.notStrictEqual(from, to)

	this.rekey(from, to)
	assert.strictEqual(oldFrom, this.get(to))
	nonExistenceCheck(this, from)
})

const rekeySame = new MethodTest("rekeySame", function <T = any, Default = any>(
	this: ObjectInternal<T, Default>,
	key: string
) {
	const oldFrom = this.get(key)
	this.rekey(key, key)
	assert.strictEqual(oldFrom, this.get(key))
})

const _default = new MethodTest("default", function <T = any, Default = any>(
	this: ObjectInternal<T, Default>,
	expected: Default
) {
	assert.strictEqual(this.default, expected)
})

const copy = new MethodTest("copy", function <T = any, Default = any>(
	this: ObjectInternal<T, Default>,
	keys: IIndexed<string>
) {
	const copied = this.copy()
	assert.strictEqual(keys.length, this.size)
	assert.strictEqual(this.size, copied.size)
	for (const key of keys) assert.strictEqual(this.get(key), copied.get(key))
})

class ObjectInternalTest<T = any, Default = any> extends ClassTest<
	ObjectInternal<T, Default>
> {
	size(expected: number) {
		this.testMethod("size", expected)
	}

	get(at: string, expected: T) {
		this.testMethod("get", at, expected)
	}

	getDefault(at: string) {
		this.testMethod("getDefault", at)
	}

	set(key: string, value: T) {
		this.testMethod("set", key, value)
	}

	setNonExistent(key: string, value: T) {
		this.testMethod("setNonExistent", key, value)
	}

	delete(key: string) {
		this.testMethod("delete", key)
	}

	deleteNonExistent(key: string) {
		this.testMethod("deleteNonExistent", key)
	}

	rekeyToUndefined(from: string, to: string) {
		this.testMethod("rekeyToUndefined", from, to)
	}

	rekey(from: string, to: string) {
		this.testMethod("rekey", from, to)
	}

	rekeySame(key: string) {
		this.testMethod("rekeySame", key)
	}

	default(expected: Default) {
		this.testMethod("default", expected)
	}

	copy(keys: IIndexed<string>) {
		this.testMethod("copy", keys)
	}

	constructor() {
		super(
			[PreMapInterface],
			[
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
				_default,
				copy
			]
		)
	}
}

export function objectInternalTest<T = any, Default = any>() {
	return new ObjectInternalTest<T, Default>()
}
