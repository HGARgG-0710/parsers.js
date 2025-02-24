import type { array } from "@hgargg-0710/one"

export type IndexingFunction<KeyType = any> = (curr: KeyType, x: any) => boolean

export interface Copiable<Type = any> {
	copy: () => Type
}

export interface HasType {
	has: (x: any) => boolean
}

export interface TestType {
	test: (x: any) => boolean
}

export interface Indexable<ValueType = any> {
	index: (x: any, ...y: any[]) => ValueType
}

export type MapClassValueExtension = <KeyType = any>(
	...f: ((...x: any[]) => any)[]
) => MapClass<KeyType, any>

export type MapClassKeyExtension = <ValueType = any>(
	...f: ((x: any) => any)[]
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

	reverse: () => this

	unique: () => number[]
	byIndex: (index: number) => DefaultType | [KeyType, ValueType]
	swap: (i: number, j: number) => this

	getIndex: (key: any) => IndexGetType

	add: (index: number, ...pairs: array.Pairs<KeyType, ValueType>) => this
	delete: (index: number, count?: number) => this
	replace: (index: number, pair: [KeyType, ValueType]) => this
	set: (key: KeyType, value: ValueType, index?: number) => this
	replaceKey: (keyFrom: KeyType, keyTo: KeyType) => this
}

export interface MapClass<KeyType = any, ValueType = any, DefaultType = any> {
	new (map: array.Pairs<KeyType, ValueType>, _default?: DefaultType): IndexMap<
		KeyType,
		ValueType
	>
	change?: IndexingFunction<KeyType>
	extend: MapClassValueExtension
	extendKey: MapClassKeyExtension

	keyExtensions: Function[]
	extensions: Function[]
}

export type * from "./FastLookupTable/interfaces.js"
export type * as HashMap from "./HashMap/interfaces.js"
export type * from "./LinearIndexMap/interfaces.js"
export type * from "./PersistentIndexMap/interfaces.js"
