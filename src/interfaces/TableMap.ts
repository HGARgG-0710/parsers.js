import type { array } from "@hgargg-0710/one"
import type {
	IConcattable,
	ICopiable,
	IDefaulting,
	IRekeyable,
	IReversible,
	ISizeable
} from "../interfaces.js"
import type { IKeysHaving, IValuesHaving } from "./MapClass.js"

export interface ITableMap<K = any, V = any, Default = any>
	extends IKeysHaving<K>,
		IValuesHaving<V>,
		ISizeable,
		IDefaulting<Default>,
		IRekeyable<K>,
		IConcattable<Iterable<[K, V]>, [K[], V[]]>,
		IReversible,
		ICopiable,
		Iterable<[K, V]> {
	unique: () => number[]
	read: (index: number) => Default | [K, V]
	swap: (i: number, j: number) => this
	add: (index: number, ...pairs: array.Pairs<K, V>) => [K[], V[]]
	delete: (index: number, count?: number) => this
	replace: (index: number, pair: [K, V]) => this
	set: (key: K, value: V, index?: number) => number
}
