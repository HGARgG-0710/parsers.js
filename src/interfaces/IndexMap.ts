import type { array } from "@hgargg-0710/one"
import type {
	IConcattable,
	ICopiable,
	IDefaulting,
	IIndexable,
	IIndexingFunction,
	IRekeyable,
	IReversible,
	ISizeable
} from "../interfaces.js"

/**
 * An interface for objects with `readonly keys: K[]` property
 */
export interface IKeysHaving<K = any> {
	readonly keys: K[]
}

/**
 * An interface for objects with `readonly values: V[]` property
 */
export interface IValuesHaving<V = any> {
	readonly values: V[]
}

/**
 * An interface representing a highly versatile
 * "table-like" `IIndexable<V | Default>` collection with a
 * default-value type `Default`, primary value type `V`,
 * key type `K`, and capability of treating this
 * collection-typeas one with the ability for random
 * access (through numeric indexes or `K`-keys), as well
 * as addition/removal of the to-be-searched-through items.
 */
export interface IIndexMap<K = any, V = any, Default = any>
	extends IIndexable<V | Default>,
		Iterable<[K, V]>,
		ICopiable,
		ISizeable,
		IDefaulting<Default>,
		IRekeyable<K>,
		IReversible,
		IKeysHaving<K>,
		IValuesHaving<V>,
		IConcattable<Iterable<[K, V]>, [K[], V[]]> {
	unique: () => number[]
	byIndex: (index: number) => Default | [K, V]
	swap: (i: number, j: number) => this

	getIndex: (key: any) => number

	add: (index: number, ...pairs: array.Pairs<K, V>) => [K[], V[]]

	delete: (index: number, count?: number) => this
	replace: (index: number, pair: [K, V]) => this
	set: (key: K, value: V, index?: number) => this
}

/**
 * This is an interface for representing an extendable 
 * factory for the `IIndexMap` objects. 
 */
export interface IMapClass<K = any, V = any, Default = any> {
	new (map?: array.Pairs<K, V>, _default?: Default): IIndexMap<K, V, Default>

	change?: IIndexingFunction<K>

	extend: <KeyType = any>(
		...f: ((...x: any[]) => any)[]
	) => IMapClass<KeyType, any>

	extendKey: <ValueType = any>(
		...f: ((x: any) => any)[]
	) => IMapClass<any, ValueType>

	readonly keyExtensions: Function[]
	readonly extensions: Function[]
}
