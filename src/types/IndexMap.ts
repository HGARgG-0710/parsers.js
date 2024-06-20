import { Token } from "./Token.js"
import { map } from "@hgargg-0710/one"
const { kv: mkv } = map

export type IndexingFunction = (curr: any, x: any) => any

export type MapClass<KeyType = any, ValueType = any> = {
	(map: Map<KeyType, ValueType>, _default: any): IndexMap<KeyType, ValueType>

	extend<NewValueType = any>(
		f: (x: ValueType) => NewValueType
	): MapClass<KeyType, NewValueType>

	extendKey<NewKeyType = any>(
		f: (x: KeyType) => NewKeyType
	): MapClass<NewKeyType, ValueType>
}

export type IndexMap<KeyType = any, ValueType = any> = {
	default(): any
	keys(): KeyType[]
	values(): ValueType[]
	index(x: any): ValueType
}

export type HasType = {
	has(x: any): boolean
}

export type TestType = {
	test(x: any): boolean
}

export function MapClass<KeyType, ValueType>(change: IndexingFunction) {
	const mapClass: MapClass<KeyType, ValueType> = function (
		map: Map<KeyType, ValueType>,
		_default: any
	): IndexMap<KeyType, ValueType> {
		const [mapKeys, mapValues] = mkv(map)
		return {
			default: () => _default,
			keys: () => mapKeys,
			values: () => mapValues,
			index: (x) =>
				((x) => (typeof x === "number" ? mapValues[x] : x))(
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
