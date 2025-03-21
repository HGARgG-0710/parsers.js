import assert from "node:assert"

import type { IPattern } from "../../../../dist/src/Pattern/interfaces.js"

import type {
	IIndexMap,
	IMapClass
} from "../../../../dist/src/IndexMap/interfaces.js"

import type {
	ISizeable,
	IRekeyable,
	IIndexable,
	IDefaulting,
	IDeletable,
	ISettable
} from "../../../../dist/src/interfaces.js"

import {
	ClassConstructorTest,
	classTest,
	method,
	methodTest,
	signatures,
	comparisonMethodTest
} from "lib/lib.js"

import { toPairs } from "../../../../dist/src/IndexMap/utils.js"

import { object, type, functional, array } from "@hgargg-0710/one"
const { structCheck } = object
const { isArray, isFunction, isNumber } = type
const { and } = functional

function handleDefault<Type = any>(
	instance: IDefaulting,
	callback: (x: IDefaulting) => Type
) {
	const r = callback(instance)
	if (r === instance.default)
		throw new TypeError("expected a non-.default value")
	return r
}

const handleByIndex = <
	KeyType = any,
	ValueType = any,
	DefaultType = any,
	IndexType = any
>(
	x: IIndexMap<KeyType, ValueType, DefaultType, IndexType>,
	i: number
) =>
	handleDefault(
		x,
		(x: IIndexMap<KeyType, ValueType, DefaultType, IndexType>) =>
			x.byIndex(i) as [KeyType, ValueType]
	)

export const isIndexable = structCheck<IIndexable>({ index: isFunction })
export const isDeletable = structCheck<IDeletable>({ delete: isFunction })
export const isKeyReplaceable = structCheck<IRekeyable>({
	replaceKey: isFunction
})
export const isSettable = structCheck<ISettable>({ set: isFunction })
export const isSizeable = structCheck<ISizeable>({ size: isNumber })
export const isDefaultHaving = structCheck<IDefaulting>(["default"])

function indexMapEquality<KeyType = any, ValueType = any>(
	indexMap: IIndexMap<KeyType, ValueType>,
	preMap: array.Pairs<KeyType, ValueType>
) {
	for (let i = 0; i < indexMap.size; ++i) {
		const [origKey, origValue] = indexMap.byIndex(i)
		const [copiedKey, copiedValue] = preMap[i]
		if (origKey !== copiedKey || origValue !== copiedValue) return false
	}
	return true
}

export const isIndexMap = and(
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
) as (x: any) => x is IIndexMap

const indexMapConstructorTest = ClassConstructorTest<IIndexMap>(isIndexMap, [
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
	return function <KeyType = any, ValueType = any, DefaultType = any>(
		instance: IIndexMap<KeyType, ValueType, DefaultType, IndexGetType>,
		key: KeyType,
		index: IndexGetType,
		safe?: IPattern<IndexGetType>
	) {
		method(
			"getIndex",
			() => {
				const gotIndex = instance.getIndex(key)
				if (safe) safe.value = gotIndex
				assert.strictEqual(converter(gotIndex), index)
			},
			key
		)
	}
}

function indexMapRekeyTest<
	KeyType = any,
	ValueType = any,
	DefaultType = any,
	IndexType = number
>(
	instance: IIndexMap<KeyType, ValueType, DefaultType, IndexType>,
	keyFrom: KeyType,
	keyTo: KeyType
) {
	method(
		"replaceKey",
		() => {
			const initVal = instance.index(keyFrom)
			instance.rekey(keyFrom, keyTo)
			assert.strictEqual(
				initVal,
				instance.values[instance.keys.indexOf(keyTo)]
			)
			assert.strictEqual(-1, instance.keys.indexOf(keyFrom))
		},
		keyFrom,
		keyTo
	)
}

function indexMapSetTest<
	KeyType = any,
	ValueType = any,
	DefaultType = any,
	IndexType = number
>(
	instance: IIndexMap<KeyType, ValueType, DefaultType, IndexType>,
	setKey: KeyType,
	setValue: ValueType
) {
	method(
		"set",
		() => {
			instance.set(setKey, setValue)
			assert.strictEqual(
				instance.values[instance.keys.indexOf(setKey)],
				setValue
			)
		},
		setKey,
		setValue
	)
}

function indexMapIteratorTest<
	KeyType = any,
	ValueType = any,
	DefaultType = any,
	IndexType = number
>(instance: IIndexMap<KeyType, ValueType, DefaultType, IndexType>) {
	method("[Symbol.iterator]", () => {
		const pairsList = [...instance]
		const truePairsList = toPairs([instance.keys, instance.values])
		assert.strictEqual(pairsList.length, truePairsList.length)
		assert(
			pairsList.every(
				([key, value], i) =>
					key === truePairsList[i][0] && value === truePairsList[i][1]
			)
		)
	})
}

function indexMapByIndexTest<
	KeyType = any,
	ValueType = any,
	DefaultType = any,
	IndexType = number
>(
	instance: IIndexMap<KeyType, ValueType, DefaultType, IndexType>,
	i: number,
	expected: any
) {
	method(
		"byIndex",
		() => {
			if (!isArray(expected)) {
				const allegedValue = instance.byIndex(i)
				assert.strictEqual(allegedValue, expected)
				return
			}
			const [allegedKey, allegedValue] = instance.byIndex(i) as [
				KeyType,
				ValueType
			]
			const [trueKey, trueValue] = expected as [KeyType, ValueType]
			assert.strictEqual(allegedKey, trueKey)
			assert.strictEqual(allegedValue, trueValue)
		},
		i
	)
}

const indexMapIndexTest = methodTest<IIndexMap>("index") as <
	KeyType = any,
	ValueType = any,
	DefaultType = any,
	IndexType = number
>(
	instance: IIndexMap<KeyType, ValueType, DefaultType, IndexType>,
	expectedValue: any,
	...input: any[]
) => any

function indexMapSwapTest<
	KeyType = any,
	ValueType = any,
	DefaultType = any,
	IndexType = number
>(
	instance: IIndexMap<KeyType, ValueType, DefaultType, IndexType>,
	i: number,
	j: number
) {
	method(
		"swap",
		() => {
			const [oldKey, oldValue] = handleByIndex(instance, i)
			const [newKey, newValue] = handleByIndex(instance, j)

			instance.swap(i, j)

			const [postOldKey, postOldValue] = handleByIndex(instance, i)
			const [postNewKey, postNewValue] = handleByIndex(instance, j)

			assert.strictEqual(oldKey, postNewKey)
			assert.strictEqual(newKey, postOldKey)

			assert.strictEqual(oldValue, postNewValue)
			assert.strictEqual(newValue, postOldValue)
		},
		i,
		j
	)
}

function indexMapCopyTest<
	KeyType = any,
	ValueType = any,
	DefaultType = any,
	IndexType = number
>(
	instance: IIndexMap<KeyType, ValueType, DefaultType, IndexType>,
	copyTestSignature: ReducedMapClassTestSignature
) {
	method("copy", () => {
		const copied = instance.copy()
		for (let i = 0; i < instance.size; ++i) {
			const [origKey, origValue] = handleByIndex(copied, i)
			const [copiedKey, copiedValue] = handleByIndex(copied, i)
			assert.strictEqual(origKey, copiedKey)
			assert.strictEqual(origValue, copiedValue)
			assert.notStrictEqual(instance, copied)
		}
		ChainIndexMapTest(copied, copyTestSignature)
	})
}

const indexMapUniqueTest = comparisonMethodTest("unique", indexMapEquality)

function indexMapReplaceTest<
	KeyType = any,
	ValueType = any,
	DefaultType = any,
	IndexType = number
>(
	instance: IIndexMap<KeyType, ValueType, DefaultType, IndexType>,
	i: number,
	pair: [KeyType, ValueType]
) {
	method(
		"replace",
		() => {
			const [origKey, origValue] = handleByIndex(instance, i)
			instance.replace(i, pair)

			const [intendedKey, intendedValue] = pair
			const [replacedKey, replacedValue] = handleByIndex(instance, i)

			assert.strictEqual(intendedKey, replacedKey)
			assert.strictEqual(intendedValue, replacedValue)

			assert.notStrictEqual(replacedValue, origValue)
			assert.notStrictEqual(replacedKey, origKey)
		},
		i,
		pair
	)
}

function indexMapAddTest<
	KeyType = any,
	ValueType = any,
	DefaultType = any,
	IndexType = number
>(
	instance: IIndexMap<KeyType, ValueType, DefaultType, IndexType>,
	i: number,
	pair: [KeyType, ValueType]
) {
	method(
		"add",
		() => {
			const newLength = instance.size + 1
			const [origKey, origValue] = handleByIndex(instance, i)
			instance.add(i, pair)
			const [addedKey, addedValue] = handleByIndex(instance, i)

			assert.notStrictEqual(addedKey, origKey)
			assert.notStrictEqual(addedValue, origValue)
			assert.strictEqual(newLength, instance.size)
		},
		i,
		pair
	)
}

function indexMapDeleteTest<
	KeyType = any,
	ValueType = any,
	DefaultType = any,
	IndexType = number
>(instance: IIndexMap<KeyType, ValueType, DefaultType, IndexType>, i: number) {
	method(
		"delete",
		() => {
			const newLength = Math.max(instance.size - 1, 0)
			const [origKey, origValue] = handleByIndex(instance, i)
			instance.delete(i)
			const [deletedKey, deletedValue] = handleByIndex(instance, i)

			assert.notStrictEqual(deletedKey, origKey)
			assert.notStrictEqual(deletedValue, origValue)
			assert.strictEqual(newLength, instance.size)
		},
		i
	)
}

export type MapClassTestSignature<KeyType = any, ValueType = any> = {
	instance:
		| [array.Pairs<KeyType, ValueType>, any?]
		| IIndexMap<KeyType, ValueType>
} & ReducedMapClassTestSignature<KeyType, ValueType>

export type ReducedMapClassTestSignature<KeyType = any, ValueType = any> = {
	byIndexTest: array.Pairs<number, any>
	indexTest: array.Pairs<any, ValueType>
	swapIndicies: [number, number][]
	uniqueTest?: array.Pairs<KeyType, ValueType>
	replaceTests: array.Pairs<number, [KeyType, ValueType]>
	addTests: array.Pairs<number, [KeyType, ValueType]>
	deleteInds: number[]
	setArgs: array.Pairs<KeyType, ValueType>
	replaceKeys: array.Pairs<KeyType, KeyType>
	isCopyTest?: boolean
	furtherSignature?: ReducedMapClassTestSignature<KeyType, ValueType>
}

export function MapClassTest<KeyType = any, ValueType = any>(
	className: string,
	mapConstructor: IMapClass<KeyType, ValueType>,
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
					replaceKeys,
					isCopyTest,
					furtherSignature
				}) =>
				() => {
					ChainIndexMapTest(
						indexMapConstructorTest(mapConstructor, instance),
						{
							byIndexTest,
							indexTest,
							swapIndicies,
							uniqueTest,
							replaceTests,
							addTests,
							deleteInds,
							setArgs,
							replaceKeys,
							isCopyTest,
							furtherSignature
						}
					)
				}
		)
	)
}

export function ChainIndexMapTest<
	KeyType = any,
	ValueType = any,
	DefaultType = any,
	IndexType = number
>(
	instance: IIndexMap<KeyType, ValueType, DefaultType, IndexType>,
	signature: ReducedMapClassTestSignature
) {
	const {
		byIndexTest,
		indexTest,
		swapIndicies,
		uniqueTest,
		replaceTests,
		addTests,
		deleteInds,
		setArgs,
		replaceKeys,
		isCopyTest,
		furtherSignature
	} = signature

	// * Explanation: when '.isCopyTest !== false', the 'MapClassTest' had been invoked, so the 'instance' is ALREADY 'assert'-ed to be an 'IndexMap';
	if (isCopyTest === false) assert(isIndexMap(instance))

	// .index
	for (const [key, value] of indexTest)
		indexMapIndexTest(instance, value, key)

	// .copy
	if ((isCopyTest || isCopyTest === undefined) && furtherSignature)
		indexMapCopyTest(instance, furtherSignature)

	// .byIndex
	for (const [i, pair] of byIndexTest) indexMapByIndexTest(instance, i, pair)

	// .add
	for (const [i, pair] of addTests) indexMapAddTest(instance, i, pair)

	// .delete
	for (const i of deleteInds) indexMapDeleteTest(instance, i)

	// .set
	for (const [setKey, setValue] of setArgs)
		indexMapSetTest(instance, setKey, setValue)

	// .unique
	if (uniqueTest) indexMapUniqueTest(instance, uniqueTest)

	// .swap
	for (const [i, j] of swapIndicies) indexMapSwapTest(instance, i, j)

	// .replace
	for (const [i, pair] of replaceTests) indexMapReplaceTest(instance, i, pair)

	// [Symbol.iterator]
	indexMapIteratorTest(instance)

	// .replaceKey
	for (const [keyFrom, keyTo] of replaceKeys)
		indexMapRekeyTest(instance, keyFrom, keyTo)
}

export const indexMapEmptyTest = {
	getIndexTest: [],
	byIndexTest: [],
	swapIndicies: [],
	addTests: [],
	replaceTests: [],
	deleteInds: [],
	setArgs: [],
	replaceKeys: []
}
