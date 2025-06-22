import { array, boolean, inplace, object, type } from "@hgargg-0710/one"
import assert from "assert"
import { TableMap } from "../../../dist/src/classes/IndexMap.js"
import type { ITableCarrier, ITableMap } from "../../../dist/src/interfaces.js"
import type { TableCarrier } from "../../../dist/src/modules/IndexMap/classes/LiquidMap.js"
import { isGoodIndex } from "../../../dist/src/utils.js"
import { assertDistinct } from "../Copiable/lib.js"
import { _default } from "../Defaulting/lib.js"
import { MethodTest, MutableClassTest } from "../lib.js"
import { iteratorCheck as iteratorSameCheck } from "../samples/Pairs/lib.js"
import { sameSizeTest, size } from "../Sizeable/lib.js"
import { carrierCompare } from "../TableCarrier/lib.js"

const { isFunction, isNumber } = type
const { T } = boolean
const { out, insert } = inplace

function byTest<K = any, V = any, Default = any>(
	tested: TableMap<K, V, Default>,
	key: K,
	expected: V | Default
) {
	assert.strictEqual(tested.by(key), expected)
}

function nonExistenceCheck<K = any, V = any, Default = any>(
	tested: TableMap<K, V, Default>,
	key: K
) {
	byTest(tested, key, tested.default)
}

function keyExistenceCheck<K = any, V = any, Default = any>(
	tested: TableMap<K, V, Default>,
	key: K
) {
	assert.notStrictEqual(tested.by(key), tested.default)
}

function viaCarrierCompare<K = any, V = any, Default = any>(
	tested: TableMap<K, V, Default>,
	carrier: ITableCarrier<K, V, Default>
) {
	carrierCompare(tested.toCarrier(), carrier)
}

function tableMapCompare<K = any, V = any, Default = any>(
	tested: TableMap<K, V, Default>,
	comparedWith: TableMap<K, V, Default>
) {
	viaCarrierCompare(tested, comparedWith.toCarrier())
}

function isKnownIndex<K = any, V = any, Default = any>(
	tested: TableMap<K, V, Default>,
	index: number
) {
	return index < tested.size && isGoodIndex(index)
}

function knownIndexCheck<K = any, V = any, Default = any>(
	tested: TableMap<K, V, Default>,
	index: number
) {
	assert(isKnownIndex(tested, index))
}

function unknownIndexCheck<K = any, V = any, Default = any>(
	tested: TableMap<K, V, Default>,
	index: number
) {
	assert(!isKnownIndex(tested, index))
}

function verifySamePair<K = any, V = any>(
	toVerify: array.Pair<K, V>,
	expected: array.Pair<K, V>
) {
	assert.strictEqual(toVerify[0], expected[0])
	assert.strictEqual(toVerify[1], expected[1])
}

function verifyDistinctPairs<K = any, V = any>(
	a: array.Pair<K, V>,
	b: array.Pair<K, V>
) {
	assert.notStrictEqual(a[0], b[0])
	assert.notStrictEqual(a[1], b[1])
}

function occurrenceIncrementCheck<K = any, V = any, Default = any>(
	tested: TableMap<K, V, Default>,
	key: K,
	callback: (t: TableMap<K, V, Default>, occurence: number) => void
) {
	const oldOccurence = tested.count(key)
	callback(tested, oldOccurence)
	assert.strictEqual(oldOccurence + 1, tested.count(key))
}

function occurenceDecrementCheck<K = any, V = any, Default = any>(
	tested: TableMap<K, V, Default>,
	key: K,
	callback: (t: TableMap<K, V, Default>, occurence: number) => void
) {
	const oldOccurence = tested.count(key)
	callback(tested, oldOccurence)
	assert.strictEqual(oldOccurence - 1, tested.count(key))
}

const TableMapInterface = {
	interfaceName: "ITableMap",
	conformance: object.structCheck({
		size: isNumber,
		default: T,
		rekey: isFunction,
		concat: isFunction,
		reverse: isFunction,
		copy: isFunction,
		[Symbol.iterator]: isFunction,
		unique: isFunction,
		read: isFunction,
		swap: isFunction,
		add: isFunction,
		delete: isFunction,
		replace: isFunction,
		set: isFunction,
		keyIndex: isFunction,
		by: isFunction,
		toCarrier: isFunction,
		fromCarrier: isFunction
	})
}

const swap = new MethodTest("swap", function <K = any, V = any, Default = any>(
	this: TableMap<K, V, Default>,
	i: number,
	j: number
) {
	knownIndexCheck(this, i)
	knownIndexCheck(this, j)
	assert.notStrictEqual(i, j)
	assert.notStrictEqual(this.read(i), this.read(j))
	verifyDistinctPairs(this.read(i) as [K, V], this.read(j) as [K, V])

	const prevI = this.read(i) as [K, V]
	const prevJ = this.read(j) as [K, V]

	this.swap(i, j)

	verifySamePair(this.read(j) as [K, V], prevI)
	verifySamePair(this.read(i) as [K, V], prevJ)
})

const set = new MethodTest("set", function <K = any, V = any, Default = any>(
	this: TableMap<K, V, Default>,
	key: K,
	value: V
) {
	keyExistenceCheck(this, key)
	this.set(key, value)
	byTest(this, key, value)
})

const readPair = new MethodTest("readPair", function <
	K = any,
	V = any,
	Default = any
>(this: TableMap<K, V, Default>, index: number, expected: [K, V]) {
	const result = this.read(index)
	assert.notStrictEqual(result, this.default)
	verifySamePair(result as [K, V], expected)
})

const readDefault = new MethodTest("readDefault", function <
	K = any,
	V = any,
	Default = any
>(this: TableMap<K, V, Default>, index: number) {
	assert.strictEqual(this.read(index), this.default)
})

const rekeySame = new MethodTest("rekeySame", function <
	K = any,
	V = any,
	Default = any
>(this: TableMap<K, V, Default>, key: K) {
	const old = this.by(key)
	this.rekey(key, key)
	byTest(this, key, old)
})

const rekeyToUndefined = new MethodTest("rekeyToUndefined", function <
	K = any,
	V = any,
	Default = any
>(this: TableMap<K, V, Default>, from: K, to: K) {
	assert.notStrictEqual(from, to)
	keyExistenceCheck(this, from)
	nonExistenceCheck(this, to)

	occurenceDecrementCheck(this, from, (tested) => {
		const oldFrom = tested.by(from)
		tested.rekey(from, to)
		byTest(tested, to, oldFrom)
	})
})

const rekeyFromBeforeTo = new MethodTest("rekeyFromBeforeTo", function <
	K = any,
	V = any,
	Default = any
>(this: TableMap<K, V, Default>, from: K, to: K) {
	assert.notStrictEqual(from, to)
	assert(this.keyIndex(from) < this.keyIndex(to))
	keyExistenceCheck(this, from)
	keyExistenceCheck(this, to)

	occurenceDecrementCheck(this, from, (tested) =>
		occurrenceIncrementCheck(tested, to, (tested) => {
			const oldFrom = tested.by(from)
			tested.rekey(from, to)
			byTest(tested, to, oldFrom)
		})
	)
})

const rekeyFromAfterTo = new MethodTest("rekeyFromAfterTo", function <
	K = any,
	V = any,
	Default = any
>(this: TableMap<K, V, Default>, from: K, to: K) {
	assert.notStrictEqual(from, to)
	assert(this.keyIndex(from) > this.keyIndex(to))
	keyExistenceCheck(this, from)
	keyExistenceCheck(this, to)

	occurenceDecrementCheck(this, from, (tested) =>
		occurrenceIncrementCheck(tested, to, (tested) => {
			const oldTo = tested.by(to)
			tested.rekey(from, to)
			byTest(tested, to, oldTo)
		})
	)
})

const by = new MethodTest("by", function <K = any, V = any, Default = any>(
	this: TableMap<K, V, Default>,
	key: K,
	value: V
) {
	keyExistenceCheck(this, key)
	byTest(this, key, value)
})

const byDefault = new MethodTest("byDefault", function <
	K = any,
	V = any,
	Default = any
>(this: TableMap<K, V, Default>, key: K) {
	nonExistenceCheck(this, key)
})

const keyIndex = new MethodTest("keyIndex", function <
	K = any,
	V = any,
	Default = any
>(this: TableMap<K, V, Default>, key: K, expected: number) {
	assert.strictEqual(this.keyIndex(key), expected)
})

const iterator = new MethodTest("Symbol.iterator", function <
	K = any,
	V = any,
	Default = any
>(this: TableMap<K, V, Default>, sameAs: array.Pairs<K, V>) {
	iteratorSameCheck(this, sameAs)
})

const reverse = new MethodTest("reverse", function <
	K = any,
	V = any,
	Default = any
>(this: TableMap<K, V, Default>, sameAs: array.Pairs<K, V>) {
	this.reverse()
	iteratorSameCheck(this, sameAs)
})

const toCarrier = new MethodTest("toCarrier", function <
	K = any,
	V = any,
	Default = any
>(this: TableMap<K, V, Default>, expected: ITableCarrier<K, V, Default>) {
	carrierCompare(this.toCarrier(), expected)
})

const copy = new MethodTest("copy", function <K = any, V = any, Default = any>(
	this: TableMap<K, V, Default>
) {
	const copied = this.copy()
	tableMapCompare(this, copied)
	sameSizeTest(this, copied)
	assertDistinct(this, copied)
})

const fromCarrier = new MethodTest("fromCarrier", function <
	K = any,
	V = any,
	Default = any
>(this: TableMap<K, V, Default>, from: ITableCarrier<K, V, Default>) {
	this.fromCarrier(from)
	viaCarrierCompare(this, from)
})

const concat = new MethodTest("concat", function <
	K = any,
	V = any,
	Default = any
>(this: TableMap<K, V, Default>, concattable: Iterable<[K, V]>) {
	const prevPairs = [...this]
	this.concat(concattable)
	iteratorSameCheck(this, prevPairs.concat([...concattable]))
})

const unique = new MethodTest("unique", function <
	K = any,
	V = any,
	Default = any
>(this: TableMap<K, V, Default>, sameAs: array.Pairs<K, V>) {
	this.unique()
	iteratorSameCheck(this, sameAs)
})

const add = new MethodTest("add", function <K = any, V = any, Default = any>(
	this: TableMap<K, V, Default>,
	index: number,
	pairs: array.Pairs<K, V>
) {
	const sameAs = [...this]
	insert(sameAs, index, ...pairs)
	this.add(index, ...pairs)
	iteratorSameCheck(this, sameAs)
})

const _delete = new MethodTest("delete", function <
	K = any,
	V = any,
	Default = any
>(this: TableMap<K, V, Default>, index: number, count: number = 1) {
	const prevPairs = [...this]
	out(prevPairs, index, count)
	this.delete(index, count)
	iteratorSameCheck(this, prevPairs)
})

const replaceKnown = new MethodTest("replaceKnown", function <
	K = any,
	V = any,
	Default = any
>(this: TableMap<K, V, Default>, index: number, pair: [K, V]) {
	knownIndexCheck(this, index)
	const prevPairs = [...this]
	prevPairs[index] = pair
	this.replace(index, pair)
	iteratorSameCheck(this, prevPairs)
})

const replaceUnknown = new MethodTest("replaceUnknown", function <
	K = any,
	V = any,
	Default = any
>(this: TableMap<K, V, Default>, index: number, pair: [K, V]) {
	unknownIndexCheck(this, index)
	const oldSelf = [...this]
	this.replace(index, pair)
	iteratorSameCheck(this, oldSelf)
})

const count = new MethodTest("count", function <
	K = any,
	V = any,
	Default = any
>(this: TableMap<K, V, Default>, key: K, expected: number) {
	assert.strictEqual(this.count(key), expected)
})

class TableMapTest<
	K = any,
	V = any,
	Default = undefined
> extends MutableClassTest<ITableMap<K, V, Default>> {
	swap(i: number, j: number) {
		this.testMethod("swap", i, j)
	}

	readPair(index: number, expected: [K, V]) {
		this.testMethod("readPair", index, expected)
	}

	readDefault(index: number) {
		this.testMethod("readDefault", index)
	}

	default(expected: Default) {
		this.testMethod("default", expected)
	}

	size(expected: number) {
		this.testMethod("size", expected)
	}

	set(key: K, value: V) {
		this.testMethod("set", key, value)
	}

	rekeyFromBeforeTo(from: K, to: K) {
		this.testMethod("rekeyFromBeforeTo", from, to)
	}

	rekeyFromAfterTo(from: K, to: K) {
		this.testMethod("rekeyFromAfterTo", from, to)
	}

	rekeySame(key: K) {
		this.testMethod("rekeySame", key)
	}

	rekeyToUndefined(from: K, to: K) {
		this.testMethod("rekeyToUndefined", from, to)
	}

	by(key: K, value: V) {
		this.testMethod("by", key, value)
	}

	byDefault(key: K) {
		this.testMethod("byDefault", key)
	}

	keyIndex(key: K, expected: number) {
		this.testMethod("keyIndex", key, expected)
	}

	iterator(sameAs: array.Pairs<K, V>) {
		this.testMethod("Symbol.iterator", sameAs)
	}

	reverse(sameAs: array.Pairs<K, V>) {
		this.testMethod("reverse", sameAs)
	}

	toCarrier(expected: TableCarrier<K, V, Default>) {
		this.testMethod("toCarrier", expected)
	}

	fromCarrier(carrier: ITableCarrier<K, V, Default>) {
		this.testMethod("fromCarrier", carrier)
	}

	concat(concattable: Iterable<[K, V]>) {
		this.testMethod("concat", concattable)
	}

	unique(sameAs: array.Pairs<K, V>) {
		this.testMethod("unique", sameAs)
	}

	add(index: number, pairs: array.Pairs<K, V>) {
		this.testMethod("add", index, pairs)
	}

	delete(index: number, count?: number) {
		this.testMethod("delete", index, count)
	}

	replaceKnown(index: number, pair: [K, V]) {
		this.testMethod("replaceKnown", index, pair)
	}

	replaceUnknown(index: number, pair: [K, V]) {
		this.testMethod("replaceUnknown", index, pair)
	}

	copy() {
		this.testMethod("copy")
	}

	count(key: K, expected: number) {
		this.testMethod("count", key, expected)
	}

	constructor() {
		super(
			[TableMapInterface],
			[
				size,
				_default,
				swap,
				readPair,
				readDefault,
				set,
				rekeyFromBeforeTo,
				rekeyFromAfterTo,
				rekeySame,
				rekeyToUndefined,
				by,
				byDefault,
				keyIndex,
				iterator,
				reverse,
				toCarrier,
				copy,
				fromCarrier,
				concat,
				unique,
				add,
				_delete,
				replaceKnown,
				replaceUnknown,
				count
			]
		)
	}
}

export function tableMapTest<K = any, V = any, Default = undefined>() {
	return new TableMapTest<K, V, Default>()
}
