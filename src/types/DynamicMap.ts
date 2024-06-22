import type { IndexingFunction, Indexable } from "./IndexMap.js"
import type { Summat } from "./Summat.js"
import type { TestType, HasType } from "./IndexMap.js"

import { map, array } from "@hgargg-0710/one"
const { kv: mkv } = map
const { insert, out } = array

// ? Add more methods for working with 'DynamicMap's? [for "static" grammars, this ought to suffice, but for others - more algorithms will have to be implemented manually. Add to the library...];
export interface DynamicMap<KeyType = any, ValueType = any> extends Indexable<ValueType> {
	keys: KeyType[]
	values: ValueType[]
	default: any
	add: (index: number, pair: [KeyType, ValueType]) => void
	delete: (index: number) => void
}

export interface DynamicMapClass<KeyType = any, ValueType = any> extends Summat {
	(map: Map<KeyType, ValueType>, _default: any): DynamicMap<KeyType, ValueType>

	extend<NewValueType = any>(
		f: (x: ValueType) => NewValueType
	): DynamicMapClass<KeyType, NewValueType>

	extendKey<NewKeyType = any>(
		f: (x: NewKeyType) => KeyType
	): DynamicMapClass<NewKeyType, ValueType>
}

export function DynamicMapClass<KeyType = any, ValueType = any>(
	change: IndexingFunction<KeyType>
): DynamicMapClass<KeyType, ValueType> {
	const dynamicClass: DynamicMapClass<KeyType, ValueType> = function (
		map: Map<KeyType, ValueType>,
		_default: any
	): DynamicMap<KeyType, ValueType> {
		const [keys, values] = mkv(map)
		return {
			keys,
			values,
			index: function (x) {
				return ((x) =>
					typeof x === "number" && x !== this.default
						? this.values[x as number]
						: x)(
					this.keys.reduce(
						(prev: any, curr: KeyType, i: number) =>
							prev !== this.default ? prev : change(curr, x) ? i : prev,
						this.default
					)
				)
			},
			default: _default,
			add: function (index: number, pair: [KeyType, ValueType]) {
				const [key, value] = pair
				this.keys = insert(this.keys, index, key)
				this.values = insert(this.values, index, value)
			},
			delete: function (index: number) {
				this.keys = out(this.keys, index)
				this.values = out(this.values, index)
			}
		}
	}
	dynamicClass.extend = (f) => DynamicMapClass((curr, x) => change(curr, f(x)))
	dynamicClass.extendKey = (f) => DynamicMapClass((curr, x) => change(f(curr), x))
	return dynamicClass
}

export const [DynamicPredicateMap, DynamicRegExpMap, DynamicSetMap, BasicDynamicMap]: [
	DynamicMapClass<Function>,
	DynamicMapClass<TestType>,
	DynamicMapClass<HasType>,
	DynamicMapClass
] = [
	(curr: Function, x: any) => curr(x),
	(curr: TestType, x: any) => curr.test(x),
	(curr: HasType, x: any) => curr.has(x),
	(curr: any, x: any) => curr === x
].map(DynamicMapClass) as [any, any, any, any]
