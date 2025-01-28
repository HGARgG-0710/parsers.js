import type { Copiable } from "../Stream/StreamClass/interfaces.js"
import type { array } from "@hgargg-0710/one"

export type IndexingFunction<KeyType = any> = (curr: KeyType, x: any) => boolean

export interface HasType {
	has: (x: any) => boolean
}

export interface TestType {
	test: (x: any) => boolean
}

export interface Indexable<ValueType = any> {
	index: (x: any, ...y: any[]) => ValueType
}

export type MapClassValueExtension<KeyType = any, ValueType = any> = (
	...f: ((x: ValueType) => any)[]
) => MapClass<KeyType, any>

export type MapClassKeyExtension<KeyType = any, ValueType = any> = (
	...f: ((x: any) => KeyType)[]
) => MapClass<any, ValueType>

export interface Sizeable {
	size: number
}

export interface DefaultHaving<Type = any> {
	default: Type
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
		DefaultHaving<DefaultType> {
	keys: KeyType[]
	values: ValueType[]

	reverse: () => any

	unique: () => number[]
	byIndex: (index: number) => DefaultType | [KeyType, ValueType]
	swap: (i: number, j: number) => any

	getIndex: (key: any) => IndexGetType

	add: (index: number, ...pairs: array.Pairs<KeyType, ValueType>) => any
	delete: (index: number, count?: number) => any
	replace: (index: number, pair: [KeyType, ValueType]) => any
	set: (key: KeyType, value: ValueType, index?: number) => any
	replaceKey: (keyFrom: KeyType, keyTo: KeyType) => any
}

export interface MapClass<KeyType = any, ValueType = any> {
	new (map: array.Pairs<KeyType, ValueType>, _default?: any): IndexMap<
		KeyType,
		ValueType
	>
	change?: IndexingFunction<KeyType>
	extend: MapClassValueExtension<KeyType, ValueType>
	extendKey: MapClassKeyExtension<KeyType, ValueType>

	keyExtensions: Function[]
	extensions: Function[]
}

export type * from "./FastLookupTable/interfaces.js"
export type * as HashMap from "./HashMap/interfaces.js"
export type * from "./LinearIndexMap/interfaces.js"
export type * from "./PersistentIndexMap/interfaces.js"
