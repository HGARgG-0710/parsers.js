import type { Summat } from "./Summat.js"
import { Token } from "./Token.js"
import { map } from "@hgargg-0710/one"
const { kv: mkv } = map

export interface IndexingFunction<KeyType = any> extends Summat {
	(curr: KeyType, x: any): boolean
}

export interface Indexable<OutType> extends Summat {
	index(x: any): OutType
}

export interface MapClass<KeyType = any, ValueType = any> extends Summat {
	(map: Map<KeyType, ValueType>, _default?: any): IndexMap<KeyType, ValueType>

	extend(f: (x: any) => any): MapClass<KeyType, ValueType>

	extendKey<NewKeyType = any>(
		f: (x: NewKeyType) => KeyType
	): MapClass<NewKeyType, ValueType>
}

export interface IndexMap<KeyType = any, ValueType = any> extends Indexable<ValueType> {
	default(): any
	keys(): KeyType[]
	values(): ValueType[]
}

export interface HasType extends Summat {
	has(x: any): boolean
}

export interface TestType extends Summat {
	test(x: any): boolean
}

export function MapClass<KeyType, ValueType>(change: IndexingFunction<KeyType>) {
	const mapClass: MapClass<KeyType, ValueType> = function (
		map: Map<KeyType, ValueType>,
		_default?: any
	): IndexMap<KeyType, ValueType> {
		const [mapKeys, mapValues] = mkv(map)
		return {
			default: () => _default,
			keys: () => mapKeys,
			values: () => mapValues,
			index: (x) =>
				((x) => (typeof x === "number" && x !== _default ? mapValues[x] : x))(
					mapKeys.reduce(
						(key: any, curr: KeyType, i: number) =>
							key !== _default ? key : change(curr, x) ? i : key,
						_default
					)
				)
		}
	}
	mapClass.extend = (f) => MapClass((curr, x) => change(curr, f(x)))
	mapClass.extendKey = (f) => MapClass((curr, x) => change(f(curr), x))
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

export const TokenMap = (mapClass: MapClass) => mapClass.extend(Token.type)
export const ValueMap = (mapClass: MapClass) => mapClass.extend(Token.value)
export const TypeMap = (mapClass: MapClass) => mapClass.extendKey((x) => x.is)
