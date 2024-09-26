import { fromPairsList } from "./utils.js"
import type {
	IndexMap,
	IndexingFunction,
	TestType,
	HasType,
	Pairs,
	MapClass,
	MapClassValueExtension,
	MapClassKeyExtension
} from "./interfaces.js"
import {
	indexMapIndex,
	indexMapReplace,
	indexMapAdd,
	indexMapDelete,
	indexMapUnique,
	indexMapByIndex,
	indexMapIterator,
	indexMapSwap,
	indexMapCopy
} from "./methods.js"
import { mapClassExtend, mapClassExtendKey } from "./methods.js"
import { current, firstStream, is } from "src/utils.js"
import { Token } from "src/Pattern/Token/classes.js"

export const MapClassPrototype = {
	index: { value: indexMapIndex },
	replace: { value: indexMapReplace },
	add: { value: indexMapAdd },
	delete: { value: indexMapDelete },
	unique: { value: indexMapUnique },
	byIndex: { value: indexMapByIndex },
	swap: { value: indexMapSwap },
	copy: { value: indexMapCopy },
	[Symbol.iterator]: { value: indexMapIterator }
}

export function MapClass<KeyType = any, ValueType = any>(
	change: IndexingFunction<KeyType>
): MapClass<KeyType, ValueType> {
	class mapClass implements IndexMap<KeyType, ValueType> {
		keys: KeyType[]
		values: ValueType[]
		default: any

		index: (x: any) => ValueType

		add: (index: number, pair: [KeyType, ValueType]) => any
		delete: (index: number) => any
		replace: (index: number, pair: [KeyType, ValueType]) => any
		unique: (start?: boolean) => IndexMap<KeyType, ValueType>
		byIndex: (index: number) => [KeyType, ValueType]
		swap: (i: number, j: number) => any
		copy: () => IndexMap<KeyType, ValueType>;
		[Symbol.iterator]: () => Generator<[KeyType, ValueType]>

		change: IndexingFunction<KeyType>

		static change: IndexingFunction<KeyType>
		static extend: MapClassValueExtension<KeyType, ValueType>
		static extendKey: MapClassKeyExtension<KeyType, ValueType>

		constructor(pairsList: Pairs<KeyType, ValueType>, _default?: any) {
			const [keys, values] = fromPairsList(pairsList)
			this.keys = keys
			this.values = values
			this.default = _default
		}
	}

	Object.defineProperties(mapClass.prototype, MapClassPrototype)
	mapClass.prototype.change = change

	mapClass.change = change
	mapClass.extend = mapClassExtend
	mapClass.extendKey = mapClassExtendKey

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
