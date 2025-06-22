import { boolean, object, type } from "@hgargg-0710/one"
import assert from "assert"
import type { IIndexed, IPreMap } from "../../../dist/src/interfaces.js"
import { assertDistinct } from "../Copiable/lib.js"
import { _default } from "../Defaulting/lib.js"
import { MethodTest, MutableClassTest, type RuntimeInterface } from "../lib.js"
import {
	sameSizeTest,
	size,
	sizeOneLess,
	sizeOneMore,
	sizeUnchanged
} from "../Sizeable/lib.js"

const { T } = boolean
const { structCheck } = object
const { isFunction, isNumber } = type

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

function keyVanishedCheck<K = any, V = any, Default = any>(
	tested: IPreMap<K, V, Default>,
	key: K,
	callback: (tested: IPreMap<K, V, Default>, key: K) => void
) {
	keyExistenceCheck(tested, key)
	callback(tested, key)
	nonExistenceCheck(tested, key)
}

function keyAppeared<K = any, V = any, Default = any>(
	tested: IPreMap<K, V, Default>,
	key: K,
	callback: (tested: IPreMap<K, V, Default>, key: K) => void
) {
	nonExistenceCheck(tested, key)
	callback(tested, key)
	keyExistenceCheck(tested, key)
}

function stillNonExistentCheck<K = any, V = any, Default = any>(
	tested: IPreMap<K, V, Default>,
	key: K,
	callback: (tested: IPreMap<K, V, Default>, key: K) => void
) {
	nonExistenceCheck(tested, key)
	callback(tested, key)
	nonExistenceCheck(tested, key)
}

function stillExistsCheck<K = any, V = any, Default = any>(
	tested: IPreMap<K, V, Default>,
	key: K,
	callback: (tested: IPreMap<K, V, Default>, key: K) => void
) {
	keyExistenceCheck(tested, key)
	callback(tested, key)
	keyExistenceCheck(tested, key)
}

function baseDelete<K = any, V = any, Default = any>(
	tested: IPreMap<K, V, Default>,
	key: K
) {
	tested.delete(key)
}

const _delete = new MethodTest("delete", function <
	K = any,
	V = any,
	Default = any
>(this: IPreMap<K, V, Default>, key: K) {
	sizeOneLess(this, (tested: IPreMap<K, V, Default>) =>
		keyVanishedCheck(tested, key, baseDelete)
	)
})

const deleteNonExistent = new MethodTest("deleteNonExistent", function <
	K = any,
	V = any,
	Default = any
>(this: IPreMap<K, V, Default>, key: K) {
	sizeUnchanged(this, (tested: IPreMap<K, V, Default>) =>
		stillNonExistentCheck(tested, key, baseDelete)
	)
})

const rekeyToUndefined = new MethodTest("rekeyToUndefined", function <
	K = any,
	V = any,
	Default = any
>(this: IPreMap<K, V, Default>, from: K, to: K) {
	sizeUnchanged(this, (tested: IPreMap<K, V, Default>) =>
		keyVanishedCheck(tested, from, (tested, from) =>
			keyAppeared(tested, to, (tested, to) => {
				const oldFrom = tested.get(from)
				tested.rekey(from, to)
				baseGetTest(tested, to, oldFrom)
			})
		)
	)
})

const rekey = new MethodTest("rekey", function <
	K = any,
	V = any,
	Default = any
>(this: IPreMap<K, V, Default>, from: K, to: K) {
	assert.notStrictEqual(from, to)
	sizeOneLess(this, (tested: IPreMap<K, V, Default>) =>
		keyVanishedCheck(tested, from, (tested, from) =>
			stillExistsCheck(tested, to, () => {
				const oldFrom = tested.get(from)
				this.rekey(from, to)
				assert.strictEqual(oldFrom, tested.get(to))
			})
		)
	)
})

export const rekeySame = new MethodTest("rekeySame", function <
	K = any,
	V = any,
	Default = any
>(this: IPreMap<K, V, Default>, key: K) {
	const oldFrom = this.get(key)
	this.rekey(key, key)
	assert.strictEqual(oldFrom, this.get(key))
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
	sizeOneMore(this, (tested: IPreMap<K, V, Default>) => {
		nonExistenceCheck(tested, key)
		this.set(key, value)
		baseGetTest(tested, key, value)
	})
})

const copy = new MethodTest("copy", function <K = any, V = any, Default = any>(
	this: IPreMap<K, V, Default>,
	keys: IIndexed<K>
) {
	const copied = this.copy()
	assert.strictEqual(keys.length, this.size)
	sameSizeTest(this, copied)
	for (const key of keys) assert.strictEqual(this.get(key), copied.get(key))
	assertDistinct(this, copied)
})

export abstract class PreMapTest<
	K = any,
	V = any,
	Default = any
> extends MutableClassTest<IPreMap<K, V, Default>> {
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

	copy(keys: IIndexed<K>) {
		this.testMethod("copy", keys)
	}

	constructor(
		interfaces: RuntimeInterface[] = [],
		methods: MethodTest[] = []
	) {
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
