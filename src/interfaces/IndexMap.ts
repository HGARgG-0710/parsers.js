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

export interface IKeysHaving<K = any> {
	readonly keys: K[]
}

export interface IValuesHaving<V = any> {
	readonly values: V[]
}

export interface IIndexMap<
	K = any,
	V = any,
	Default = any,
	IndexGetType = number
> extends IIndexable<V | Default>,
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

	getIndex: (key: any) => IndexGetType

	add: (index: number, ...pairs: array.Pairs<K, V>) => [K[], V[]]

	delete: (index: number, count?: number) => this
	replace: (index: number, pair: [K, V]) => this
	set: (key: K, value: V, index?: number) => this
}

export interface IMapClass<K = any, V = any, Default = any> {
	new (map?: array.Pairs<K, V>, _default?: Default): IIndexMap<K, V, Default>

	change?: IIndexingFunction<K>

	extend: <KeyType = any>(
		...f: ((...x: any[]) => any)[]
	) => IMapClass<KeyType, any>

	extendKey: <ValueType = any>(
		...f: ((x: any) => any)[]
	) => IMapClass<any, ValueType>

	keyExtensions: Function[]
	extensions: Function[]
}
