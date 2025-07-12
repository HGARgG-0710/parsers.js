import type {
	ICopiable,
	IIndexable,
	IIndexingFunction
} from "../../../interfaces.js"
import type {
	IFromTableCarrierConvertible,
	ILiquidMap,
	IToModifiableConvertible
} from "./LiquidMap.js"

/**
 * This is an interface for a copiable `IIndexable<V | Default>` object,
 * capable of being converted-to from an `ITableCarrier<K, V, Default>`,
 * as well as made modifiable via an obtainable `ITableMap<K, V, Default>`
 * representation.
 */
export interface IIndexMap<K = any, V = any, Default = any>
	extends IIndexable<V | Default>,
		ICopiable,
		IFromTableCarrierConvertible<K, V, Default>,
		IToModifiableConvertible<K, V, Default> {}

/**
 * This is an interface for representing an extendable
 * factory for the `IIndexMap<K, V, Default>` objects.
 */
export interface IMapClass<K = any, V = any, Default = any> {
	new (liquid: ILiquidMap<K, V, Default>): IIndexMap<K, V, Default>
	extend: <K = any>(...f: ((...x: any[]) => any)[]) => IMapClass<K, any>
	extendKey: <V = any>(...f: ((x: any) => any)[]) => IMapClass<any, V>
	readonly change?: IIndexingFunction<K>
	readonly keyExtensions: readonly Function[]
	readonly extensions: readonly Function[]
}
