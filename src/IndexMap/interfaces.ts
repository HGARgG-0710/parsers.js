import type { Summat } from "@hgargg-0710/summat.ts"
import type { Copiable } from "../Stream/CopiableStream/interfaces.js"

export interface IndexingFunction<KeyType = any> extends Summat {
	(curr: KeyType, x: any): boolean
}

export interface HasType extends Summat {
	has: (x: any) => boolean
}

export interface TestType extends Summat {
	test: (x: any) => boolean
}

export interface Indexable<OutType = any> extends Summat {
	index: (x: any) => OutType
}

export type MapClassValueExtension<KeyType = any, ValueType = any> = (
	f: (x: ValueType) => any
) => MapClass<KeyType, any>

export type MapClassKeyExtension<KeyType = any, ValueType = any> = <NewKeyType = any>(
	f: (x: NewKeyType) => KeyType
) => MapClass<NewKeyType, ValueType>

export type Pairs<KeyType = any, ValueType = any> = [KeyType, ValueType][]

export interface VolatileIndexMap<KeyType = any, ValueType = any> extends Summat {
	add: (index: number, ...pairs: Pairs<KeyType, ValueType>) => any
	delete: (index: number, count?: number) => any
	replace: (index: number, pair: [KeyType, ValueType]) => any
}

export interface StableIndexMap<KeyType = any, ValueType = any>
	extends Indexable<ValueType>,
		Iterable<[KeyType, ValueType]>,
		Copiable<IndexMap<KeyType, ValueType>> {
	keys: KeyType[]
	values: ValueType[]
	default: any
	size: number
	unique: (start?: boolean) => IndexMap<KeyType, ValueType>
	byIndex: (index: number) => [KeyType, ValueType]
	swap: (i: number, j: number) => any
}

export interface Changing<Type = any> extends Summat {
	change: IndexingFunction<Type>
}

export interface IndexMap<KeyType = any, ValueType = any>
	extends StableIndexMap<KeyType, ValueType>,
		VolatileIndexMap<KeyType, ValueType> {}

export interface MapClass<KeyType = any, ValueType = any> extends Summat {
	new (map: Pairs<KeyType, ValueType>, _default?: any): IndexMap<KeyType, ValueType>
	change: IndexingFunction<KeyType>
	extend: MapClassValueExtension<KeyType, ValueType>
	extendKey: MapClassKeyExtension<KeyType, ValueType>
}

export * as LinearIndexMap from "./LinearIndexMap/interfaces.js"
export * as PersistentIndexMap from "./PersistentIndexMap/interfaces.js"
