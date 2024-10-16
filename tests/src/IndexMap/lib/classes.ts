import assert from "node:assert"

import type {
	KeyReplaceable,
	Deletable,
	Settable
} from "../../../../dist/src/IndexMap/HashMap/interfaces.js"
import type {
	Sizeable,
	Indexable,
	IndexMap,
	MapClass,
	Pairs,
	DefaultHaving
} from "../../../../dist/src/IndexMap/interfaces.js"
import {
	ClassConstructorTest,
	classTest,
	method,
	methodTest,
	signatures,
	comparisonMethodTest
} from "lib/lib.js"

import { toPairsList } from "../../../../dist/src/IndexMap/utils.js"

import { object, typeof as type, function as _f } from "@hgargg-0710/one"
const { structCheck } = object
const { isArray, isFunction, isNumber } = type
const { and } = _f

export const isIndexable = structCheck<Indexable>({ index: isFunction })
export const isDeletable = structCheck<Deletable>({ delete: isFunction })
export const isKeyReplaceable = structCheck<KeyReplaceable>({ replaceKey: isFunction })
export const isSettable = structCheck<Settable>({ set: isFunction })
export const isSizeable = structCheck<Sizeable>({ size: isNumber })
export const isDefaultHaving = structCheck<DefaultHaving>(["default"])

function indexMapEquality<KeyType = any, ValueType = any>(
	indexMap: IndexMap<KeyType, ValueType>,
	preMap: Pairs<KeyType, ValueType>
) {
	for (let i = 0; i < indexMap.size; ++i) {
		const [origKey, origValue] = indexMap.byIndex(i)
		const [copiedKey, copiedValue] = preMap[i]
		if (origKey !== copiedKey || origValue !== copiedValue) return false
	}
	return true
}

const isIndexMap = and(
	structCheck({
		keys: isArray,
		values: isArray,
		unique: isFunction,
		byIndex: isFunction,
		swap: isFunction,
		getIndex: isFunction,
		add: isFunction,
		[Symbol.iterator]: isFunction
	}),
	isDefaultHaving,
	isIndexable,
	isSettable,
	isSizeable,
	isKeyReplaceable,
	isDeletable
) as (x: any) => x is IndexMap

const indexMapConstructorTest = ClassConstructorTest<IndexMap>(isIndexMap, [
	"unique",
	"byIndex",
	"swap",
	"getIndex",
	"add",
	"delete",
	"replace",
	"set",
	"replaceKey",
	Symbol.iterator
])

export function baseIndexMapGetIndexTest<IndexGetType = any>(
	converter: (x: IndexGetType) => number
) {
	return function <KeyType = any, ValueType = any>(
		instance: IndexMap<KeyType, ValueType, IndexGetType>,
		key: KeyType,
		index: IndexGetType
	) {
		method(
			"getIndex",
			() => assert.strictEqual(converter(instance.getIndex(key)), index),
			key
		)
	}
}

function indexMapReplaceKeyTest<KeyType = any, ValueType = any>(
	instance: IndexMap<KeyType, ValueType>,
	keyFrom: KeyType,
	keyTo: KeyType
) {
	method(
		"replaceKey",
		() => {
			const initVal = instance.index(keyFrom)
			instance.replaceKey(keyFrom, keyTo)
			assert.strictEqual(initVal, instance.values[instance.keys.indexOf(keyTo)])
			assert.strictEqual(-1, instance.keys.indexOf(keyFrom))
		},
		keyFrom,
		keyTo
	)
}

function indexMapSetTest<KeyType = any, ValueType = any>(
	instance: IndexMap<KeyType, ValueType>,
	setKey: KeyType,
	setValue: ValueType
) {
	method(
		"set",
		() => {
			instance.set(setKey, setValue)
			assert.strictEqual(instance.values[instance.keys.indexOf(setKey)], setValue)
		},
		setKey,
		setValue
	)
}

function indexMapIteratorTest<KeyType = any, ValueType = any>(
	instance: IndexMap<KeyType, ValueType>
) {
	method("[Symbol.iterator]", () => {
		const pairsList = [...instance]
		const truePairsList = toPairsList([instance.keys, instance.values])
		assert.strictEqual(pairsList.length, truePairsList.length)
		assert(
			pairsList.every(
				([key, value], i) =>
					key === truePairsList[i][0] && value === truePairsList[i][1]
			)
		)
	})
}

function indexMapByIndexTest<KeyType = any, ValueType = any>(
	instance: IndexMap<KeyType, ValueType>,
	i: number,
	expected: [KeyType, ValueType]
) {
	method(
		"byIndex",
		() => {
			const [allegedKey, allegedValue] = instance.byIndex(i)
			const [trueKey, trueValue] = expected
			assert.strictEqual(allegedKey, trueKey)
			assert.strictEqual(allegedValue, trueValue)
		},
		i
	)
}

const indexMapIndexTest = methodTest<IndexMap>("index")

function indexMapSwapTest<KeyType = any, ValueType = any>(
	instance: IndexMap<KeyType, ValueType>,
	i: number,
	j: number
) {
	method(
		"swap",
		() => {
			const [oldKey, oldValue] = instance.byIndex(i)
			const [newKey, newValue] = instance.byIndex(j)

			instance.swap(i, j)

			const [postOldKey, postOldValue] = instance.byIndex(i)
			const [postNewKey, postNewValue] = instance.byIndex(j)

			assert.strictEqual(oldKey, postNewKey)
			assert.strictEqual(newKey, postOldKey)

			assert.strictEqual(oldValue, postNewValue)
			assert.strictEqual(newValue, postOldValue)
		},
		i,
		j
	)
}

function indexMapCopyTest<KeyType = any, ValueType = any>(
	instance: IndexMap<KeyType, ValueType>
) {
	method("copy", () => {
		const copied = instance.copy()
		for (let i = 0; i < instance.keys.length; ++i) {
			const [origKey, origValue] = instance.byIndex(i)
			const [copiedKey, copiedValue] = copied.byIndex(i)
			assert.strictEqual(origKey, copiedKey)
			assert.strictEqual(origValue, copiedValue)
			assert.notStrictEqual(instance, copied)
		}
	})
}

const indexMapUniqueTest = comparisonMethodTest("unique", indexMapEquality)

function indexMapReplaceTest<KeyType = any, ValueType = any>(
	instance: IndexMap<KeyType, ValueType>,
	i: number,
	pair: [KeyType, ValueType]
) {
	method(
		"replace",
		() => {
			const [origKey, origValue] = instance.byIndex(i)
			instance.replace(i, pair)

			const [intendedKey, intendedValue] = pair
			const [replacedKey, replacedValue] = instance.byIndex(i)

			assert.strictEqual(intendedKey, replacedKey)
			assert.strictEqual(intendedValue, replacedValue)

			assert.notStrictEqual(replacedValue, origValue)
			assert.notStrictEqual(replacedKey, origKey)
		},
		i,
		pair
	)
}

function indexMapAddTest<KeyType = any, ValueType = any>(
	instance: IndexMap<KeyType, ValueType>,
	i: number,
	pair: [KeyType, ValueType]
) {
	method(
		"add",
		() => {
			const [origKey, origValue] = instance.byIndex(i)
			instance.add(i, pair)
			const [addedKey, addedValue] = instance.byIndex(i)

			assert.notStrictEqual(addedKey, origKey)
			assert.notStrictEqual(addedValue, origValue)

			const newLength = instance.keys.length + 1
			assert.strictEqual(newLength, instance.keys.length)
			assert.strictEqual(newLength, instance.values.length)
		},
		i,
		pair
	)
}

function indexMapDeleteTest<KeyType = any, ValueType = any>(
	instance: IndexMap<KeyType, ValueType>,
	i: number
) {
	method(
		"delete",
		() => {
			const [origKey, origValue] = instance.byIndex(i)
			instance.delete(i)
			const [deletedKey, deletedValue] = instance.byIndex(i)

			assert.notStrictEqual(deletedKey, origKey)
			assert.notStrictEqual(deletedValue, origValue)

			const newLength = Math.max(instance.keys.length - 1, 0)
			assert.strictEqual(newLength, instance.keys.length)
			assert.strictEqual(newLength, instance.values.length)
		},
		i
	)
}

export type MapClassTestSignature<KeyType = any, ValueType = any> = {
	instance: [Pairs<KeyType, ValueType>, any]
	byIndexTest: [number, [KeyType, ValueType]][]
	indexTest: Pairs<KeyType, ValueType>
	swapIndicies: [number, number][]
	uniqueTest: Pairs<KeyType, ValueType>
	replaceTests: [number, [KeyType, ValueType]][]
	addTests: [number, [KeyType, ValueType]][]
	deleteInds: number[]
	setArgs: Pairs<KeyType, ValueType>
	replaceKeys: Pairs<KeyType, KeyType>
}

export function MapClassTest<KeyType = any, ValueType = any>(
	className: string,
	mapConstructor: MapClass<KeyType, ValueType>,
	testSignatures: MapClassTestSignature<KeyType, ValueType>[]
) {
	classTest(`(IndexMap) ${className}`, () =>
		signatures(
			testSignatures,
			({
					instance,
					byIndexTest,
					indexTest,
					swapIndicies,
					uniqueTest,
					replaceTests,
					addTests,
					deleteInds,
					setArgs,
					replaceKeys
				}) =>
				() => {
					const mapInstance: IndexMap<KeyType, ValueType> =
						indexMapConstructorTest(mapConstructor, instance)

					// .index
					for (const [key, value] of indexTest)
						indexMapIndexTest(mapInstance, value, key)

					// .copy
					indexMapCopyTest(mapInstance)

					// .add
					for (const [i, pair] of addTests)
						indexMapAddTest(mapInstance, i, pair)

					// .delete
					for (const i of deleteInds) indexMapDeleteTest(mapInstance, i)

					// .set
					for (const [setKey, setValue] of setArgs)
						indexMapSetTest(mapInstance, setKey, setValue)

					// .unique
					indexMapUniqueTest(mapInstance, uniqueTest)

					// .byIndex
					for (const [i, pair] of byIndexTest)
						indexMapByIndexTest(mapInstance, i, pair)

					// .swap
					for (const [i, j] of swapIndicies) indexMapSwapTest(mapInstance, i, j)

					// .replace
					for (const [i, pair] of replaceTests)
						indexMapReplaceTest(mapInstance, i, pair)

					// [Symbol.iterator]
					indexMapIteratorTest(mapInstance)

					// .replaceKey
					for (const [keyFrom, keyTo] of replaceKeys)
						indexMapReplaceKeyTest(mapInstance, keyFrom, keyTo)
				}
		)
	)
}
