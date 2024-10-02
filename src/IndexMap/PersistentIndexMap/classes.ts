import type { Pattern } from "src/Pattern/interfaces.js"
import type { IndexMap, MapClass, Pairs } from "../interfaces.js"
import {
	indexMapCopy,
	indexMapIterator,
	indexMapSet,
	indexMapSizeGetter
} from "../methods.js"
import {
	persistentIndexMapAdd,
	persistentIndexMapDelete,
	persistentIndexMapGetIndex,
	persistentIndexMapSwap,
	persistentIndexMapUnique
} from "./methods.js"

import type { PersistentIndexMap as PersistentIndexMapType } from "./interfaces.js"
import {
	subByIndex,
	subDefault,
	subIndex,
	subKeys,
	subReplace,
	subReplaceKey,
	subValues
} from "../SubHaving/methods.js"

export const Pointer = <Type = any>(value: Type): Pattern<Type> => ({ value })

export class PersistentIndexMap<KeyType = any, ValueType = any>
	implements PersistentIndexMapType<KeyType, ValueType>
{
	keys: KeyType[]
	values: ValueType[]
	indexes: Pattern<number>[]
	size: number
	default: any

	sub: IndexMap<KeyType, ValueType>
	index: (x: any) => [KeyType, ValueType]
	copy: () => IndexMap<KeyType, ValueType>
	set: (key: KeyType, value: ValueType, index: number) => any
	getIndex: (key: KeyType) => Pattern<number>

	add: (index: number, ...pairs: Pairs<KeyType, ValueType>) => any
	delete: (index: number, count?: number) => any
	replace: (index: number, pair: [KeyType, ValueType]) => any
	replaceKey: (keyFrom: KeyType, keyTo: KeyType) => any
	unique: (start?: boolean) => IndexMap<KeyType, ValueType>
	byIndex: (index: number) => [KeyType, ValueType]
	swap: (i: number, j: number) => any;
	[Symbol.iterator]: () => Generator<[KeyType, ValueType]>;

	["constructor"]: new (pairs: Pairs<KeyType, ValueType>, _default?: any) => IndexMap<
		KeyType,
		ValueType
	>

	constructor(indexMap: IndexMap<KeyType, ValueType>) {
		this.sub = indexMap

		const size = indexMap.size
		this.indexes = Array(size)
		for (let i = 0; i < size; ++i) this.indexes[i] = Pointer(i)
	}
}

Object.defineProperties(PersistentIndexMap, {
	index: { value: subIndex },
	byIndex: { value: subByIndex },
	copy: { value: indexMapCopy },
	replace: { value: subReplace },
	add: { value: persistentIndexMapAdd },
	delete: { value: persistentIndexMapDelete },
	replaceKey: { value: subReplaceKey },
	unique: { value: persistentIndexMapUnique },
	set: { value: indexMapSet },
	swap: { value: persistentIndexMapSwap },
	getIndex: { value: persistentIndexMapGetIndex },
	keys: { get: subKeys },
	values: { get: subValues },
	default: { get: subDefault },
	size: {
		get: indexMapSizeGetter
	},
	[Symbol.iterator]: {
		value: indexMapIterator
	}
})

export const toIndexPersistent =
	<KeyType = any, ValueType = any>(mapClass: MapClass<KeyType, ValueType>) =>
	(pairs: Pairs<KeyType, ValueType>) =>
		new PersistentIndexMap<KeyType, ValueType>(new mapClass(pairs))
