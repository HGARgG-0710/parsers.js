import type { ICopiable, IIndexable } from "../interfaces.js"
import type {
	IFromTableCarrierConvertible,
	IToModifiableConvertible
} from "../modules/IndexMap/interfaces/LiquidMap.js"

/**
 * Represents a table-like entity that is extendable
 * [either over its keys, or input] to
 * obtain an `IMidMap<K/NK, V, Default>`.
 */
export interface IExtendableMap<K = any, V = any, Default = any, Index = K> {
	extend<NI = any>(f: (newIndexed: NI) => Index): IMidMap<K, V, Default, NI>
	extendKey<NK = any>(f: (newKey: NK) => K): IMidMap<NK, V, Default, Index>
}

/**
 * This is an interface representing an intermediate
 * extension entity, which can either be (itself) extended
 * in the exactly same fashion as `IExtendableMap<K, V, Default>`
 * dictates, or `finalize()`d, to obtain an `IIndexMap<K, V, Default>`.
 */
export interface IMidMap<K = any, V = any, Default = any, Index = K>
	extends IExtendableMap<K, V, Default, Index> {
	finalize(): IIndexMap<K, V, Default, Index>
}

/**
 * This is an interface for a copiable `IIndexable<V | Default>` object,
 * capable of being converted-to from an `ITableCarrier<K, V, Default>`,
 * as well as made modifiable via an obtainable `ITableMap<K, V, Default>`
 * representation, and extendable via either new functions for
 * table's key-transformations, or that of table's `index()`-inputs,
 * permitting one to treat a table as a list of "extensible"
 * abstraction layers that affect thae way that the keys and
 * input are treated.
 */
export interface IIndexMap<K = any, V = any, Default = any, Index = K>
	extends ISimpleMap<K, V, Default, Index>,
		IExtendableMap<K, V, Default, Index> {}

/**
 * This is an `IIndexMap<K, V, Default>` without the
 * extension capabilities. Immutable unless implementation
 * states otherwise.
 */
export interface ISimpleMap<K = any, V = any, Default = any, Index = K>
	extends IIndexable<Index, V | Default>,
		ICopiable,
		IFromTableCarrierConvertible<K, V, Default>,
		IToModifiableConvertible<K, V, Default> {}

export type * from "../modules/IndexMap/interfaces/LiquidMap.js"
export type * from "../modules/IndexMap/interfaces/TableMap.js"
