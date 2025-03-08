import type { array } from "@hgargg-0710/one"

import type {
	Copiable,
	Defaulting,
	IndexingFunction,
	Rekeyable,
	Sizeable
} from "../interfaces.js"

export interface Indexable<ValueType = any> {
	index: (x: any, ...y: any[]) => ValueType
}

export interface IndexMap<
	KeyType = any,
	ValueType = any,
	DefaultType = any,
	IndexGetType = number
> extends Indexable<ValueType | DefaultType>,
		Iterable<[KeyType, ValueType]>,
		Copiable<IndexMap<KeyType, ValueType, DefaultType, IndexGetType>>,
		Sizeable,
		Defaulting<DefaultType>,
		Rekeyable<KeyType> {
	keys: KeyType[]
	values: ValueType[]

	reverse: () => this

	unique: () => number[]
	byIndex: (index: number) => DefaultType | [KeyType, ValueType]
	swap: (i: number, j: number) => this

	getIndex: (key: any) => IndexGetType

	add: (index: number, ...pairs: array.Pairs<KeyType, ValueType>) => this
	delete: (index: number, count?: number) => this
	replace: (index: number, pair: [KeyType, ValueType]) => this
	set: (key: KeyType, value: ValueType, index?: number) => this
}

export interface MapClass<KeyType = any, ValueType = any, DefaultType = any> {
	new (map: array.Pairs<KeyType, ValueType>, _default?: DefaultType): IndexMap<
		KeyType,
		ValueType
	>
	change?: IndexingFunction<KeyType>
	extend: <KeyType = any>(...f: ((...x: any[]) => any)[]) => MapClass<KeyType, any>
	extendKey: <ValueType = any>(...f: ((x: any) => any)[]) => MapClass<any, ValueType>

	keyExtensions: Function[]
	extensions: Function[]
}

export type * from "./LookupTable/interfaces.js"
export type * from "./HashMap/interfaces.js"
export type * from "./LinearIndexMap/interfaces.js"
export type * from "./PersistentIndexMap/interfaces.js"
