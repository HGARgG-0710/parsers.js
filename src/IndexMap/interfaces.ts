import type { Summat } from "@hgargg-0710/summat.ts"

export interface IndexingFunction<KeyType = any> extends Summat {
	(curr: KeyType, x: any): boolean
}

export interface HasType extends Summat {
	has(x: any): boolean
}

export interface TestType extends Summat {
	test(x: any): boolean
}

export interface Indexable<OutType = any> extends Summat {
	index(x: any): OutType
}

export type MapClassValueExtension<KeyType = any, ValueType = any> = <NewValueType = any>(
	f: (x: ValueType) => NewValueType
) => MapClass<KeyType, NewValueType>

export type MapClassKeyExtension<KeyType = any, ValueType = any> = <NewKeyType = any>(
	f: (x: NewKeyType) => KeyType
) => MapClass<NewKeyType, ValueType>

export interface IndexMap<KeyType = any, ValueType = any>
	extends Indexable<ValueType>,
		Iterable<[KeyType, ValueType]> {
	keys: KeyType[]
	values: ValueType[]
	default: any
	change: IndexingFunction<KeyType>
	add: (index: number, pair: [KeyType, ValueType]) => any
	delete: (index: number) => any
	replace: (index: number, pair: [KeyType, ValueType]) => any
	unique: (start?: boolean) => IndexMap<KeyType, ValueType>
	byIndex: (index: number) => [KeyType, ValueType]
	swap: (i: number, j: number) => any
}

export interface MapClass<KeyType = any, ValueType = any> extends Summat {
	(map: [KeyType, ValueType][], _default?: any): IndexMap<KeyType, ValueType>
	extend: MapClassValueExtension<KeyType, ValueType>
	extendKey: MapClassKeyExtension<KeyType, ValueType>
}
