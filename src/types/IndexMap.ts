import type { Summat } from "@hgargg-0710/summat.ts"
import { Token } from "./Token.js"
import { current, firstStream, is } from "../aliases.js"

import { inplace } from "@hgargg-0710/one"
const { insert } = inplace

export interface Indexable<OutType> extends Summat {
	index(x: any): OutType
}
export interface IndexingFunction<KeyType = any> extends Summat {
	(curr: KeyType, x: any): boolean
}
export interface HasType extends Summat {
	has(x: any): boolean
}
export interface TestType extends Summat {
	test(x: any): boolean
}

export type MapClassValueExtension<KeyType = any, ValueType = any> = <NewValueType = any>(
	f: (x: ValueType) => NewValueType
) => MapClass<KeyType, NewValueType>

export type MapClassKeyExtension<KeyType = any, ValueType = any> = <NewKeyType = any>(
	f: (x: NewKeyType) => KeyType
) => MapClass<NewKeyType, ValueType>

// ? Add more methods for working with 'IndexMap's? [for "static" grammars, this ought to suffice, but for others - more algorithms will have to be implemented manually. Add to the library...];
export interface IndexMap<KeyType = any, ValueType = any>
	extends Indexable<ValueType>,
		Iterable<[KeyType, ValueType]> {
	keys: KeyType[]
	values: ValueType[]
	default: any
	change: IndexingFunction<KeyType>
	add: (index: number, pair: [KeyType, ValueType]) => any
	delete: (index: number) => any
	replace: (index: number, pair: [KeyType, ValueType]) => any
	unique: (start?: boolean) => IndexMap<KeyType, ValueType>
	byIndex: (index: number) => [KeyType, ValueType]
}

export interface MapClass<KeyType = any, ValueType = any> extends Summat {
	(map: [KeyType, ValueType][], _default?: any): IndexMap<KeyType, ValueType>
	extend: MapClassValueExtension<KeyType, ValueType>
	extendKey: MapClassKeyExtension<KeyType, ValueType>
}

export function indexMapIndex<KeyType = any, ValueType = any>(
	this: IndexMap<KeyType, ValueType>,
	x: any
) {
	let current = this.default
	for (let i = this.keys.length; i--; ) {
		const index = this.keys.length - 1 - i
		if (this.change(this.keys[index], x)) {
			current = this.values[index]
			break
		}
	}
	return current
}

export function indexMapReplace<KeyType = any, ValueType = any>(
	this: IndexMap<KeyType, ValueType>,
	index: number,
	pair: [KeyType, ValueType]
): IndexMap<KeyType, ValueType> {
	const [key, value] = pair
	this.keys[index] = key
	this.values[index] = value
	return this
}

export function indexMapAdd<KeyType = any, ValueType = any>(
	this: IndexMap<KeyType, ValueType>,
	index: number,
	...pairs: [KeyType, ValueType][]
): IndexMap<KeyType, ValueType> {
	const [keys, values] = fromPairsList(pairs)
	insert(this.keys, index, ...keys)
	insert(this.values, index, ...values)
	return this
}

export function indexMapDelete<KeyType = any, ValueType = any>(
	this: IndexMap<KeyType, ValueType>,
	index: number
): IndexMap<KeyType, ValueType> {
	this.keys.splice(index, 1)
	this.values.splice(index, 1)
	return this
}

export function indexMapUnique<KeyType = any, ValueType = any>(
	this: IndexMap<KeyType, ValueType>,
	start: boolean = true
): IndexMap<KeyType, ValueType> {
	const indexSet = new Set()
	const predicate = start ? (i: number) => i < this.keys.length : (i: number) => i >= 0
	const change = (-1) ** +!start

	for (let i = +!start * this.keys.length; predicate(i); i += change)
		if (!indexSet.has(this.keys[i])) indexSet.add(i)

	const filterPredicate = (_x: any, i: number) => indexSet.has(i)
	this.keys = this.keys.filter(filterPredicate)
	this.values = this.values.filter(filterPredicate)

	return this
}

export function* indexMapIterator<KeyType = any, ValueType = any>(
	this: IndexMap<KeyType, ValueType>
): Generator<[KeyType, ValueType]> {
	for (let k = this.keys.length; k--; ) {
		const index = this.keys.length - 1 - k
		yield [this.keys[index], this.values[index]]
	}
}

export function indexMapByIndex<KeyType = any, ValueType = any>(
	this: IndexMap<KeyType, ValueType>,
	index: number
): [KeyType, ValueType] {
	return [this.keys[index], this.values[index]]
}

export function mapClassExtend<KeyType = any, ValueType = any>(
	change: IndexingFunction<KeyType>
): MapClassValueExtension<KeyType, ValueType> {
	return (f) => MapClass((curr, x) => change(curr, f(x)))
}

export function mapClassExtendKey<KeyType = any, ValueType = any>(
	change: IndexingFunction<KeyType>
): MapClassKeyExtension<KeyType, ValueType> {
	return (f) => MapClass((curr, x) => change(f(curr), x))
}

export function MapClass<KeyType = any, ValueType = any>(
	change: IndexingFunction<KeyType>
): MapClass<KeyType, ValueType> {
	const mapClass: MapClass<KeyType, ValueType> = function (
		pairsList: [KeyType, ValueType][],
		_default?: any
	): IndexMap<KeyType, ValueType> {
		const [keys, values] = fromPairsList(pairsList)
		return {
			keys,
			values,
			change,
			index: indexMapIndex<KeyType, ValueType>,
			replace: indexMapReplace<KeyType, ValueType>,
			add: indexMapAdd<KeyType, ValueType>,
			delete: indexMapDelete<KeyType, ValueType>,
			unique: indexMapUnique<KeyType, ValueType>,
			byIndex: indexMapByIndex<KeyType, ValueType>,
			default: _default,
			[Symbol.iterator]: indexMapIterator<KeyType, ValueType>
		}
	}
	mapClass.extend = mapClassExtend(change)
	mapClass.extendKey = mapClassExtendKey(change)
	return mapClass
}

export const [PredicateMap, RegExpMap, SetMap, BasicMap]: [
	MapClass<Function>,
	MapClass<TestType>,
	MapClass<HasType>,
	MapClass
] = [
	(curr: Function, x: any) => curr(x),
	(curr: TestType, x: any) => curr.test(x),
	(curr: HasType, x: any) => curr.has(x),
	(curr: any, x: any) => curr === x
].map(MapClass) as [any, any, any, any]

export const [TokenMap, ValueMap, CurrentMap, FirstStreamMap] = [
	Token.type,
	Token.value,
	current,
	firstStream
].map((x) => (mapClass: MapClass) => mapClass.extend(x))

export const TypeMap = (mapClass: MapClass) => mapClass.extendKey(is)

export function table<KeyType = any, OutType = any>(
	indexMap: IndexMap<KeyType, OutType>
): [KeyType[], OutType[]] {
	return [indexMap.keys, indexMap.values]
}

export function fromPairsList<KeyType = any, ValueType = any>(
	mapPairs: [KeyType, ValueType][]
): [KeyType[], ValueType[]] {
	const keys = []
	const values = []
	for (const [key, value] of mapPairs) {
		keys.push(key)
		values.push(value)
	}
	return [keys, values]
}
