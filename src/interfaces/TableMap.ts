import type { array } from "@hgargg-0710/one"
import type {
	IConcattable,
	ICopiable,
	IDefaulting,
	IRekeyable,
	IReversible,
	ISizeable
} from "../interfaces.js"

/**
 * An interface representing a highly versatile
 * modifiable table-collection with a
 * default-value type `Default`, primary value type `V`,
 * key type `K`, and capability of treating this
 * collection-typeas one with the ability for random
 * access (through numeric indexes), as well
 * as addition/removal of the to-be-searched-through items.
 */
export interface ITableMap<K = any, V = any, Default = any>
	extends ISizeable,
		IDefaulting<Default>,
		IRekeyable<K>,
		IConcattable<Iterable<[K, V]>, [K[], V[]]>,
		IReversible,
		ICopiable,
		Iterable<[K, V]> {
	readonly keys: K[]
	readonly values: V[]

	unique: () => number[]
	read: (index: number) => Default | [K, V]
	swap: (i: number, j: number) => this
	add: (index: number, ...pairs: array.Pairs<K, V>) => [K[], V[]]
	delete: (index: number, count?: number) => this
	replace: (index: number, pair: [K, V]) => this
	set: (key: K, value: V, index?: number) => number
}
