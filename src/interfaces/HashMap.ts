import type { IConcattable, IHashable, IIndexable } from "../interfaces.js"
import type { IPreMap } from "../modules/HashMap/interfaces/PlainMap.js"

/**
 * Represents a hash function.
 */
export type IHash<K = any, InternalKey = any> = (
	x: K,
	...y: any[]
) => InternalKey

/**
 * Represents an extendable factory of `IHashMap`
 * instances based off `IPreMap` instances.
 */
export interface IHashClass<K = any, V = any, InternalKey = any, Default = any>
	extends IHashable<K, InternalKey> {
	new (structure: IPreMap<InternalKey, V, Default>): IHashMap<K, V, Default>
	extend: (f: (x: any) => K) => IHashClass<any, V, InternalKey>
}

/**
 * Represents an `IIndexable<V | Default>` structure with a
 * default-value type `Default`, primary value type `V`,
 * key type `K` and conformance to `IPreMap<K, V, Default>`.
 */
export interface IHashMap<K = any, V = any, Default = any>
	extends IPreMap<K, V, Default>,
		IIndexable<V | Default>,
		IConcattable<Iterable<[K, V]>, IHashMap<K, V, Default>> {}

export type * from "../modules/HashMap/interfaces/PlainMap.js"
