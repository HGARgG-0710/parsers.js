import type { IndexingFunction } from "./IndexMap.js"
import type { Summat } from "./Summat.js"

import { map } from "@hgargg-0710/one"
const { kv: mkv } = map

// TODO: GENERALIZE THIS! [into an 'Indexable' (change curr. 'Indexable' to 'NumberIndexable')]
// ! It's the new 'Indexable' that's supposed to be taken in by functions that (currently) accept the 'IndexMap' (also - one ought to generalize all of these to a SINGLE type...);
export interface DynamicMap<KeyType = any, ValueType = any> extends Summat {
	keys: KeyType[]
	values: ValueType[]
	index(x: any): ValueType
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
