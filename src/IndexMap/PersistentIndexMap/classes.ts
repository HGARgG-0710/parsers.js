import type { Pointer as PointerType } from "../../Pattern/interfaces.js"
import type { IndexMap, Pairs } from "../interfaces.js"
import type { PersistentIndexMap as PersistentIndexMapType } from "./interfaces.js"

import {
	valueByIndex,
	valueDefault,
	valueIndex,
	valueKeys,
	valueReplace,
	valueReplaceKey,
	valueValues
} from "../../Pattern/methods.js"

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

import { BasicPattern } from "src/Pattern/abstract.js"
import { extendPrototype } from "../../utils.js"

import { inplace } from "@hgargg-0710/one"
const { mutate } = inplace

// * Explanation: objects are passed by reference, ergo, it's possible to keep the
// * 	index of a 'PersistentIndexMap' consistent across multiple sources,
// * 	via wrapping it into a one-property object;
export const Pointer = <Type = any>(value: Type): PointerType<Type> => ({ value })

export class PersistentIndexMap<KeyType = any, ValueType = any>
	extends BasicPattern<IndexMap<KeyType, ValueType>>
	implements
		PersistentIndexMapType<KeyType, ValueType>,
		PointerType<IndexMap<KeyType, ValueType>>
{
	value: IndexMap<KeyType, ValueType, number>
	keys: KeyType[]
	values: ValueType[]
	indexes: PointerType<number>[]
	size: number
	default: any

	index: (x: any) => ValueType
	copy: () => IndexMap<KeyType, ValueType>
	set: (key: KeyType, value: ValueType, index: number) => any
	getIndex: (key: KeyType) => PointerType<number>

	add: (index: number, ...pairs: Pairs<KeyType, ValueType>) => any
	delete: (index: number, count?: number) => any
	replace: (index: number, pair: [KeyType, ValueType]) => any
	replaceKey: (keyFrom: KeyType, keyTo: KeyType) => any
	unique: (start?: boolean) => IndexMap<KeyType, ValueType>
	byIndex: (index: number) => any
	swap: (i: number, j: number) => any;
	[Symbol.iterator]: () => Generator<[KeyType, ValueType]>;

	["constructor"]: new (pairs: Pairs<KeyType, ValueType>, _default?: any) => IndexMap<
		KeyType,
		ValueType
	>

	constructor(indexMap: IndexMap<KeyType, ValueType>) {
		super(indexMap)
		mutate((this.indexes = new Array(indexMap.size)), (_x, i) => Pointer(i))
	}
}

extendPrototype(PersistentIndexMap, {
	index: { value: valueIndex },
	byIndex: { value: valueByIndex },
	copy: { value: indexMapCopy },
	replace: { value: valueReplace },
	add: { value: persistentIndexMapAdd },
	delete: { value: persistentIndexMapDelete },
	replaceKey: { value: valueReplaceKey },
	unique: { value: persistentIndexMapUnique },
	set: { value: indexMapSet },
	swap: { value: persistentIndexMapSwap },
	getIndex: { value: persistentIndexMapGetIndex },
	keys: { get: valueKeys },
	values: { get: valueValues },
	default: { get: valueDefault },
	size: {
		get: indexMapSizeGetter
	},
	[Symbol.iterator]: {
		value: indexMapIterator
	}
})
