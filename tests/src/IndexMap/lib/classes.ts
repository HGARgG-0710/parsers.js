import { describe, it } from "node:test"
import assert from "node:assert"

import type {
	IndexMap,
	MapClass,
	Pairs
} from "../../../../dist/src/IndexMap/interfaces.js"
import { ClassConstructorTest } from "lib/lib.js"

import { object, typeof as type, boolean } from "@hgargg-0710/one"
import { toPairsList } from "../../../../dist/src/IndexMap/utils.js"

const { structCheck } = object
const { isArray, isFunction, isNumber } = type
const { T } = boolean

function assertIndexMapEquality<KeyType = any, ValueType = any>(
	indexMap: IndexMap<KeyType, ValueType>,
	preMap: Pairs<KeyType, ValueType>
) {
	for (let i = 0; i < indexMap.size; ++i) {
		const [origKey, origValue] = indexMap.byIndex(i)
		const [copiedKey, copiedValue] = preMap[i]
		assert.strictEqual(origKey, copiedKey)
		assert.strictEqual(origValue, copiedValue)
	}
}

const isIndexMap = structCheck<IndexMap>({
	keys: isArray,
	values: isArray,
	default: T,
	size: isNumber,
	unique: isFunction,
	byIndex: isFunction,
	swap: isFunction,
	getIndex: isFunction,
	add: isFunction,
	delete: isFunction,
	replace: isFunction,
	set: isFunction,
	replaceKey: isFunction,
	[Symbol.iterator]: isFunction
})

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
		testPairs: Pairs<KeyType, IndexGetType>
	) {
		for (const [key, trueIndex] of testPairs)
			it(`method: .getIndex(${key.toString()})`, () =>
				assert.strictEqual(converter(instance.getIndex(key)), trueIndex))
	}
}

function indexMapReplaceKeyTest<KeyType = any, ValueType = any>(
	instance: IndexMap<KeyType, ValueType>,
	replaceKeys: Pairs<KeyType, KeyType>
) {
	for (const [keyFrom, keyTo] of replaceKeys)
		it(`method: .replaceKey(${keyFrom.toString()}, ${keyTo.toString()})`, () => {
			const initVal = instance.index(keyFrom)
			instance.replaceKey(keyFrom, keyTo)
			assert.strictEqual(initVal, instance.values[instance.keys.indexOf(keyTo)])
			assert.strictEqual(-1, instance.keys.indexOf(keyFrom))
		})
}

function indexMapSetTest<KeyType = any, ValueType = any>(
	instance: IndexMap<KeyType, ValueType>,
	setArgs: Pairs<KeyType, ValueType>
) {
	for (const [setKey, setValue] of setArgs)
		it(`method: .set(${setKey.toString()}, ${setValue.toString()})`, () => {
			instance.set(setKey, setValue)
			assert.strictEqual(instance.values[instance.keys.indexOf(setKey)], setValue)
		})
}

function indexMapIteratorTest<KeyType = any, ValueType = any>(
	instance: IndexMap<KeyType, ValueType>
) {
	it(`method: [Symbol.iterator]`, () => {
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
	i: number[],
	trueIndexed: Pairs<KeyType, ValueType>
) {
	for (const j of i)
		it(`method: .byIndex(${j})`, () => {
			const [allegedKey, allegedValue] = instance.byIndex(j)
			const [trueKey, trueValue] = trueIndexed[j]
			assert.strictEqual(allegedKey, trueKey)
			assert.strictEqual(allegedValue, trueValue)
		})
}

function indexMapIndexTest<KeyType = any, ValueType = any>(
	instance: IndexMap<KeyType, ValueType>,
	map: Pairs<KeyType, ValueType>
) {
	for (const [key, value] of map)
		it(`method: .index(${key.toString()})`, () =>
			assert.strictEqual(value, instance.index(key)))
}

function indexMapSwapTest<KeyType = any, ValueType = any>(
	instance: IndexMap<KeyType, ValueType>,
	pair: [number, number][]
) {
	for (const [i, j] of pair) {
		const tempInstance = instance.copy()
		it(`method: .swap(${i}, ${j})`, () => {
			const [oldKey, oldValue] = tempInstance.byIndex(i)
			const [newKey, newValue] = tempInstance.byIndex(j)

			tempInstance.swap(i, j)

			const [postOldKey, postOldValue] = tempInstance.byIndex(i)
			const [postNewKey, postNewValue] = tempInstance.byIndex(j)

			assert.strictEqual(oldKey, postNewKey)
			assert.strictEqual(newKey, postOldKey)

			assert.strictEqual(oldValue, postNewValue)
			assert.strictEqual(newValue, postOldValue)
		})
	}
}

function indexMapCopyTest<KeyType = any, ValueType = any>(
	instance: IndexMap<KeyType, ValueType>
) {
	it("method: .copy()", () => {
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

function indexMapUniqueTest<KeyType = any, ValueType = any>(
	instance: IndexMap<KeyType, ValueType>,
	uniqueMap: Pairs<KeyType, ValueType>
) {
	it("method: .unique()", () =>
		assertIndexMapEquality(instance.copy().unique(), uniqueMap))
}

function indexMapReplaceTest<KeyType = any, ValueType = any>(
	instance: IndexMap<KeyType, ValueType>,
	newPairs: [number, [KeyType, ValueType]][]
) {
	for (const [i, pair] of newPairs)
		it(`method: .replace(${i})`, () => {
			const replaced: IndexMap<KeyType, ValueType> = instance
				.copy()
				.replace(i, pair)

			const [intendedKey, intendedValue] = pair
			const [replacedKey, replacedValue] = replaced.byIndex(i)
			const [origKey, origValue] = instance.byIndex(i)

			assert.strictEqual(intendedKey, replacedKey)
			assert.strictEqual(intendedValue, replacedValue)

			assert.notStrictEqual(replacedValue, origValue)
			assert.notStrictEqual(replacedKey, origKey)
		})
}

function indexMapAddTest<KeyType = any, ValueType = any>(
	instance: IndexMap<KeyType, ValueType>,
	addPairs: [number, [KeyType, ValueType]][]
) {
	for (const [i, pair] of addPairs)
		it(`method: .add(${i})`, () => {
			const copy: IndexMap<KeyType, ValueType> = instance.copy().add(i, pair)
			const [addedKey, addedValue] = copy.byIndex(i)
			const [origKey, origValue] = instance.byIndex(i)

			assert.notStrictEqual(addedKey, origKey)
			assert.notStrictEqual(addedValue, origValue)

			const newLength = instance.keys.length + 1
			assert.strictEqual(newLength, copy.keys.length)
			assert.strictEqual(newLength, copy.values.length)
		})
}

function indexMapDeleteTest<KeyType = any, ValueType = any>(
	instance: IndexMap<KeyType, ValueType>,
	deleteInds: number[]
) {
	for (const i of deleteInds)
		it(`method: .add(${i})`, () => {
			const copy: IndexMap<KeyType, ValueType> = instance.copy().delete(i)
			const [deletedKey, deletedValue] = copy.byIndex(i)
			const [origKey, origValue] = instance.byIndex(i)

			assert.notStrictEqual(deletedKey, origKey)
			assert.notStrictEqual(deletedValue, origValue)

			const newLength = Math.max(instance.keys.length - 1, 0)
			assert.strictEqual(newLength, copy.keys.length)
			assert.strictEqual(newLength, copy.values.length)
		})
}

export type MapClassTestSignature<KeyType = any, ValueType = any> = {
	instance: [Pairs<KeyType, ValueType>, any]
	byIndexIndicies: number[]
	byIndexTest: Pairs<KeyType, ValueType>
	indexTest: Pairs<KeyType, ValueType>
	swapIndicies: [number, number][]
	uniqueTest: Pairs<KeyType, ValueType>
	replaceTest: [number, [KeyType, ValueType]][]
	addTest: [number, [KeyType, ValueType]][]
	deleteInds: number[]
	setArgs: Pairs<KeyType, ValueType>
	replaceKeys: Pairs<KeyType, KeyType>
}

export function MapClassTest<KeyType = any, ValueType = any>(
	className: string,
	mapConstructor: MapClass<KeyType, ValueType>,
	signatures: MapClassTestSignature<KeyType, ValueType>[]
) {
	const size = signatures.length
	describe(`class: (IndexMap) ${className}`, () => {
		for (let i = 0; i < size; ++i) {
			const {
				instance,
				byIndexIndicies,
				byIndexTest,
				indexTest,
				swapIndicies,
				uniqueTest,
				replaceTest,
				addTest,
				deleteInds,
				setArgs,
				replaceKeys
			} = signatures[i]

			const mapInstance: IndexMap<KeyType, ValueType> = indexMapConstructorTest(
				mapConstructor,
				instance
			)

			indexMapByIndexTest(mapInstance, byIndexIndicies, byIndexTest) // 	.byIndex
			indexMapIndexTest(mapInstance, indexTest) // 						.index
			indexMapSwapTest(mapInstance, swapIndicies) //						.swap
			indexMapCopyTest(mapInstance) //									.copy
			indexMapUniqueTest(mapInstance, uniqueTest) //						.unique
			indexMapReplaceTest(mapInstance, replaceTest) //					.replace
			indexMapAddTest(mapInstance, addTest) //							.add
			indexMapDeleteTest(mapInstance, deleteInds) //						.delete
			indexMapIteratorTest(mapInstance) //								[Symbol.iterator]
			indexMapSetTest(mapInstance, setArgs) // 							.set
			indexMapReplaceKeyTest(mapInstance, replaceKeys) //					.replaceKey
		}
	})
}
