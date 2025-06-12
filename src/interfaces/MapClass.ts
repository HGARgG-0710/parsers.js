import type { ICopiable, IIndexable, IIndexingFunction } from "../interfaces.js"
import type { ITableMap } from "./TableMap.js"

/**
 * This is an interface for a copiable `IIndexable<V | Default>` object.
 */
export interface IPreIndexMap<V = any, Default = any>
	extends IIndexable<V | Default>,
		ICopiable {}

/**
 * An interface representing a simple `IPreIndexable<V | Default>`,
 * with capability of being converted to a mutable form of `ITableMap<K, V, Default>`.
 */
export interface IIndexMap<K = any, V = any, Default = any>
	extends IPreIndexMap<V, Default> {
	toModifiable(): ITableMap<K, V, Default>
	fromModifiable(table: ITableMap<K, V, Default>): IIndexMap<K, V, Default>
}

/**
 * This is an interface for representing an extendable
 * factory for the `IIndexMap<K, V, Default>` objects.
 */
export interface IMapClass<K = any, V = any, Default = any> {
	new (keys?: K[], values?: V[], _default?: Default): IIndexMap<K, V, Default>
	change?: IIndexingFunction<K>
	extend: <K = any>(...f: ((...x: any[]) => any)[]) => IMapClass<K, any>
	extendKey: <V = any>(...f: ((x: any) => any)[]) => IMapClass<any, V>
	keyExtensions: Function[]
	extensions: Function[]
}
