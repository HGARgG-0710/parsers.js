import type {
	ICopiable,
	IIndexable,
	IIndexingFunction,
	ITableMap
} from "../../../interfaces.js"
import type { ITableCarrier } from "./LiquidMap.js"
import type { ILiquidMap } from "./LiquidMap.js"

/**
 * This is an interface for a copiable `IIndexable<V | Default>` object.
 */
export interface IIndexMap<K = any, V = any, Default = any>
	extends IIndexable<V | Default>,
		ICopiable {
	toModifiable(): ITableMap<K, V, Default>
	fromCarrier(carrier: ITableCarrier<K, V, Default>): void
}

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
