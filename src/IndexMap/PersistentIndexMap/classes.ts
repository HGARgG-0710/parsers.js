import type { Pattern } from "src/Pattern/interfaces.js"
import type { IndexMap, MapClass, Pairs } from "../interfaces.js"
import { indexMapCopy, indexMapIterator, indexMapSizeGetter } from "../methods.js"
import type { PersistentIndexValue, UnderPersistentMap } from "./interfaces.js"
import {
	persistentIndexMapAdd,
	persistentIndexMapByIndex,
	persistentIndexMapDefault,
	persistentIndexMapDelete,
	persistentIndexMapIndex,
	persistentIndexMapKeysGetter,
	persistentIndexMapReplace,
	persistentIndexMapReplaceKey,
	persistentIndexMapSet,
	persistentIndexMapUnique,
	persistentIndexMapValuesGetter
} from "./methods.js"

import type { PersistentIndexMap as PersistentIndexMapType } from "./interfaces.js"

import { inplace } from "@hgargg-0710/one"
const { mutate } = inplace

export const Pointer = <Type = any>(value: Type): Pattern<Type> => ({ value })

export class PersistentIndexMap<KeyType = any, ValueType = any>
	implements PersistentIndexMapType<KeyType, ValueType>
{
	keys: KeyType[]
	values: PersistentIndexValue<ValueType>[]
	size: number
	default: any

	indexMap: UnderPersistentMap<KeyType, ValueType>
	index: (x: any) => PersistentIndexValue<ValueType>
	copy: () => IndexMap<KeyType, PersistentIndexValue<ValueType>>
	set: (key: KeyType, value: ValueType, index: number) => any

	add: (index: number, ...pairs: Pairs<KeyType, ValueType>) => any
	delete: (index: number, count?: number) => any
	replace: (index: number, pair: [KeyType, ValueType]) => any
	replaceKey: (keyFrom: KeyType, keyTo: KeyType) => any
	unique: (start?: boolean) => IndexMap<KeyType, PersistentIndexValue<ValueType>>
	byIndex: (index: number) => [KeyType, PersistentIndexValue<ValueType>]
	swap: (i: number, j: number) => any;
	[Symbol.iterator]: () => Generator<[KeyType, PersistentIndexValue<ValueType>]>

	constructor(indexMap: IndexMap<KeyType, ValueType>) {
		mutate(indexMap.values, (x, i) => [Pointer(i), x])
		this.indexMap = indexMap as UnderPersistentMap<KeyType, ValueType>
	}
}

Object.defineProperties(PersistentIndexMap, {
	index: { value: persistentIndexMapIndex },
	byIndex: { value: persistentIndexMapByIndex },
	copy: { value: indexMapCopy },
	replace: { value: persistentIndexMapReplace },
	add: { value: persistentIndexMapAdd },
	delete: { value: persistentIndexMapDelete },
	replaceKey: { value: persistentIndexMapReplaceKey },
	unique: { value: persistentIndexMapUnique },
	set: { value: persistentIndexMapSet },
	keys: { get: persistentIndexMapKeysGetter },
	values: { get: persistentIndexMapValuesGetter },
	default: { get: persistentIndexMapDefault },
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
