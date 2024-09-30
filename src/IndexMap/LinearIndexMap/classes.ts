import type {
	IndexingFunction,
	MapClass,
	MapClassValueExtension,
	MapClassKeyExtension,
	Pairs,
	TestType,
	HasType
} from "../interfaces.js"

import {
	indexMapUnique,
	indexMapByIndex,
	indexMapSwap,
	indexMapCopy,
	indexMapIterator,
	mapClassExtend,
	mapClassExtendKey,
	indexMapSizeGetter
} from "../methods.js"

import { fromPairsList } from "../utils.js"
import type { LinearIndexMap } from "./interfaces.js"

import {
	linearIndexMapIndex,
	linearIndexMapReplace,
	linearIndexMapAdd,
	linearIndexMapDelete,
	linearIndexMapSet,
	linearIndexMapReplaceKey
} from "./methods.js"

const LinearMapClassPrototype = {
	set: { value: linearIndexMapSet },
	index: { value: linearIndexMapIndex },
	replace: { value: linearIndexMapReplace },
	add: { value: linearIndexMapAdd },
	delete: { value: linearIndexMapDelete },
	unique: { value: indexMapUnique },
	byIndex: { value: indexMapByIndex },
	replaceKey: { value: linearIndexMapReplaceKey },
	swap: { value: indexMapSwap },
	copy: { value: indexMapCopy },
	size: { get: indexMapSizeGetter },
	[Symbol.iterator]: { value: indexMapIterator }
}

export function LinearMapClass<KeyType = any, ValueType = any>(
	change: IndexingFunction<KeyType>
): MapClass<KeyType, ValueType> {
	class linearMapClass implements LinearIndexMap<KeyType, ValueType> {
		keys: KeyType[]
		values: ValueType[]
		default: any
		size: number

		index: (x: any) => ValueType

		add: (index: number, ...pairs: Pairs<KeyType, ValueType>) => any
		delete: (index?: number, count?: number) => any
		replace: (index: number, pair: [KeyType, ValueType]) => any
		replaceKey: (keyFrom: KeyType, keyTo: KeyType) => any
		set: (key: KeyType, value: ValueType, index: number) => any
		unique: (start?: boolean) => LinearIndexMap<KeyType, ValueType>
		byIndex: (index: number) => [KeyType, ValueType]
		swap: (i: number, j: number) => any
		copy: () => LinearIndexMap<KeyType, ValueType>;
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

	Object.defineProperties(linearMapClass.prototype, LinearMapClassPrototype)
	linearMapClass.prototype.change = change

	linearMapClass.change = change
	linearMapClass.extend = mapClassExtend
	linearMapClass.extendKey = mapClassExtendKey

	return linearMapClass
}

export const [LinearPredicateMap, LinearRegExpMap, LinearSetMap, LinearBasicMap]: [
	MapClass<Function>,
	MapClass<TestType>,
	MapClass<HasType>,
	MapClass
] = [
	(curr: Function, x: any) => curr(x),
	(curr: TestType, x: any) => curr.test(x),
	(curr: HasType, x: any) => curr.has(x),
	(curr: any, x: any) => curr === x
].map(LinearMapClass) as [any, any, any, any]
