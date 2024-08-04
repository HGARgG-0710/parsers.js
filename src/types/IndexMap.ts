import type { Summat } from "./Summat.js"
import { current, is, Token } from "main.js"

import { map } from "@hgargg-0710/one"
const { kv: mkv } = map

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

// ? Add more methods for working with 'IndexMap's? [for "static" grammars, this ought to suffice, but for others - more algorithms will have to be implemented manually. Add to the library...];
export interface IndexMap<KeyType = any, ValueType = any> extends Indexable<ValueType> {
	keys: KeyType[]
	values: ValueType[]
	default: any
	add: (index: number, pair: [KeyType, ValueType]) => void
	delete: (index: number) => void
	replace: (index: number, pair: [KeyType, ValueType]) => void
}

export interface MapClass<KeyType = any, ValueType = any> extends Summat {
	(map: Map<KeyType, ValueType>, _default?: any): IndexMap<KeyType, ValueType>

	extend<NewValueType = any>(
		f: (x: ValueType) => NewValueType
	): MapClass<KeyType, NewValueType>

	extendKey<NewKeyType = any>(
		f: (x: NewKeyType) => KeyType
	): MapClass<NewKeyType, ValueType>
}

export function MapClass<KeyType = any, ValueType = any>(
	change: IndexingFunction<KeyType>
): MapClass<KeyType, ValueType> {
	const dynamicClass: MapClass<KeyType, ValueType> = function (
		map: Map<KeyType, ValueType>,
		_default?: any
	): IndexMap<KeyType, ValueType> {
		const [keys, values] = mkv(map)
		return {
			keys,
			values,
			index: function (x) {
				return ((x) => (x !== this.default ? this.values[x] : x))(
					this.keys.reduce(
						(prev: any, curr: KeyType, i: number) =>
							prev !== this.default ? prev : change(curr, x) ? i : prev,
						this.default
					)
				)
			},
			default: _default,
			replace: function (index: number, pair: [KeyType, ValueType]) {
				const [key, value] = pair
				this.keys[index] = key
				this.values[index] = value
			},
			add: function (index: number, pair: [KeyType, ValueType]) {
				const [key, value] = pair
				this.keys.splice(index, 0, key)
				this.values.splice(index, 0, value)
			},
			delete: function (index: number) {
				this.keys.splice(index, 1)
				this.values.splice(index, 1)
			}
		}
	}
	dynamicClass.extend = (f) => MapClass((curr, x) => change(curr, f(x)))
	dynamicClass.extendKey = (f) => MapClass((curr, x) => change(f(curr), x))
	return dynamicClass
}

export const [DynamicPredicateMap, DynamicRegExpMap, DynamicSetMap, BasicDynamicMap]: [
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

export const [TokenMap, ValueMap, CurrentMap] = [Token.type, Token.value, current].map(
	(x) => (mapClass: MapClass) => mapClass.extend(x)
)

export const TypeMap = (mapClass: MapClass) => mapClass.extendKey(is)
