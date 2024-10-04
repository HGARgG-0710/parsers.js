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
	indexMapSizeGetter,
	indexMapSet
} from "../methods.js"
import {
	mapClassExtend,
	mapClassExtendKey,
	linearIndexMapIndex,
	linearIndexMapReplace,
	linearIndexMapAdd,
	linearIndexMapDelete,
	linearIndexMapReplaceKey,
	linearIndexMapGetIndex,
	optimizedLinearIndexMapGetIndex
} from "./methods.js"

import { fromPairsList } from "../utils.js"
import type { LinearIndexMap } from "./interfaces.js"

import { function as _f } from "@hgargg-0710/one"
const { trivialCompose } = _f

const LinearMapClassPrototype = {
	set: { value: indexMapSet },
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
	extensions: Function[],
	keyExtensions: Function[],
	change?: IndexingFunction<KeyType>
): MapClass<KeyType, ValueType> {
	class linearMapClass implements LinearIndexMap<KeyType, ValueType> {
		keys: KeyType[]
		alteredKeys: any[]

		values: ValueType[]
		default: any
		size: number;

		["constructor"]: new (
			pairs: Pairs<KeyType, ValueType>,
			_default?: any
		) => LinearIndexMap<KeyType, ValueType>

		index: (x: any) => ValueType

		add: (index: number, ...pairs: Pairs<KeyType, ValueType>) => any
		delete: (index?: number, count?: number) => any
		replace: (index: number, pair: [KeyType, ValueType]) => any
		replaceKey: (keyFrom: KeyType, keyTo: KeyType) => any
		set: (key: KeyType, value: ValueType, index: number) => any
		unique: (start?: boolean) => LinearIndexMap<KeyType, ValueType>
		byIndex: (index: number) => [KeyType, ValueType]
		getIndex: (key: any) => number
		swap: (i: number, j: number) => any
		copy: () => LinearIndexMap<KeyType, ValueType>;
		[Symbol.iterator]: () => Generator<[KeyType, ValueType]>

		change?: IndexingFunction<KeyType>

		static change?: IndexingFunction<KeyType>
		static extend: MapClassValueExtension<KeyType, ValueType>
		static extendKey: MapClassKeyExtension<KeyType, ValueType>

		static keyExtensions: Function[]
		static extensions: Function[]

		extension: Function
		keyExtension: Function

		constructor(pairsList: Pairs<KeyType, ValueType>, _default?: any) {
			const [keys, values] = fromPairsList(pairsList)
			this.keys = keys
			this.values = values
			this.default = _default
			this.alteredKeys = this.keys.map((x) => this.keyExtension(x))
		}
	}

	Object.defineProperties(linearMapClass.prototype, LinearMapClassPrototype)

	linearMapClass.prototype.extension = trivialCompose(...extensions)
	linearMapClass.prototype.keyExtension = trivialCompose(...keyExtensions)
	linearMapClass.prototype.change = change

	linearMapClass.extensions = extensions
	linearMapClass.keyExtensions = keyExtensions
	linearMapClass.change = change
	linearMapClass.extend = mapClassExtend<KeyType>
	linearMapClass.extendKey = mapClassExtendKey<KeyType, ValueType>

	linearMapClass.prototype.getIndex = change
		? linearIndexMapGetIndex<KeyType, ValueType>
		: optimizedLinearIndexMapGetIndex<KeyType, ValueType>

	return linearMapClass
}

export const OptimizedLinearMap = LinearMapClass([], [])

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
].map((change) => LinearMapClass<any, any>([], [], change)) as [any, any, any, any]
