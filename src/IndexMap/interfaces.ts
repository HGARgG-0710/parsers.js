import type { Summat } from "@hgargg-0710/summat.ts"
import type { Copiable } from "../Stream/StreamClass/interfaces.js"

export interface IndexingFunction<KeyType = any> extends Summat {
	(curr: KeyType, x: any): boolean
}

export interface HasType extends Summat {
	has: (x: any) => boolean
}

export interface TestType extends Summat {
	test: (x: any) => boolean
}

export interface Indexable<ValueType = any> extends Summat {
	index: (x: any) => ValueType
}

export type MapClassValueExtension<KeyType = any, ValueType = any> = (
	...f: ((x: ValueType) => any)[]
) => MapClass<KeyType, any>

export type MapClassKeyExtension<KeyType = any, ValueType = any> = (
	...f: ((x: any) => KeyType)[]
) => MapClass<any, ValueType>

export type Pair<KeyType = any, ValueType = any> = [KeyType, ValueType]
export type Pairs<KeyType = any, ValueType = any> = Pair<KeyType, ValueType>[]

export interface Sizeable extends Summat {
	size: number
}

export interface DefaultHaving extends Summat {
	default: any
}

export interface IndexMap<KeyType = any, ValueType = any, IndexGetType = number>
	extends Indexable<ValueType>,
		Iterable<[KeyType, ValueType]>,
		Copiable<IndexMap<KeyType, ValueType>>,
		Sizeable,
		DefaultHaving {
	constructor: new (pairs: Pairs<KeyType, ValueType>, _default?: any) => IndexMap<
		KeyType,
		ValueType
	>

	keys: KeyType[]
	values: ValueType[]
	unique: (start?: boolean) => IndexMap<KeyType, ValueType>
	byIndex: (index: number) => any
	swap: (i: number, j: number) => any

	getIndex: (key: any) => IndexGetType

	add: (index: number, ...pairs: Pairs<KeyType, ValueType>) => any
	delete: (index: number, count?: number) => any
	replace: (index: number, pair: [KeyType, ValueType]) => any
	set: (key: KeyType, value: ValueType, index?: number) => any
	replaceKey: (keyFrom: KeyType, keyTo: KeyType) => any
}

export interface MapClass<KeyType = any, ValueType = any> extends Summat {
	new (map: Pairs<KeyType, ValueType>, _default?: any): IndexMap<KeyType, ValueType>
	change?: IndexingFunction<KeyType>
	extend: MapClassValueExtension<KeyType, ValueType>
	extendKey: MapClassKeyExtension<KeyType, ValueType>

	keyExtensions: Function[]
	extensions: Function[]
}

export type * as FastLookupTable from "./FastLookupTable/interfaces.js"
export type * as HashMap from "./HashMap/interfaces.js"
export type * as LinearIndexMap from "./LinearIndexMap/interfaces.js"
export type * as PersistentIndexMap from "./PersistentIndexMap/interfaces.js"
