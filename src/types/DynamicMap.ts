import type { IndexingFunction, Indexable } from "./IndexMap.js"
import type { Summat } from "./Summat.js"

import { map } from "@hgargg-0710/one"
const { kv: mkv } = map

export interface DynamicMap<KeyType = any, ValueType = any>
	extends Indexable<ValueType>,
		Summat {
	keys: KeyType[]
	values: ValueType[]
	default: any
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
			default: _default
		}
	}
	dynamicClass.extend = (f) => DynamicMapClass((curr, x) => change(curr, f(x)))
	dynamicClass.extendKey = (f) => DynamicMapClass((curr, x) => change(f(curr), x))
	return dynamicClass
}
