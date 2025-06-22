import type { ICopiable, IDefaulting, ISizeable } from "../../../interfaces.js"
import type { ITableMap } from "./TableMap.js"

/**
 * This is a table-entity that can be converted to a
 * modifiable form via an obtainable `ITableMap<K, V, Default>`
 * instance.
 */
export interface IToModifiableConvertible<K = any, V = any, Default = any> {
	toModifiable(): ITableMap<K, V, Default>
}

/**
 * This is an interface for representing entities that can be
 * converted-to from an `ITableCarrier<K, V, Default>`.
 */
export interface IFromTableCarrierConvertible<K = any, V = any, Default = any> {
	fromCarrier(carrier: ITableCarrier<K, V, Default>): this
}

/**
 * This is an interface representing an entity
 * that can be converted (partially or wholly
 * conserving its information) to an `ITableCarrier<K, V, Default>`.
 */
export interface IToTableCarrierConvertible<K = any, V = any, Default = any> {
	toCarrier(): ITableCarrier<K, V, Default>
}

/**
 * This is an interface representing an entity
 * that can be described in its wholeness via the
 * data encapsulated by an `ITableCarrier<K, V, Default>`
 * instance, and which, thus, is convertible to- and from-
 * an `ITableCarrier<K, V, Default>`
 */
export interface ITableCarrierConvertible<K = any, V = any, Default = any>
	extends IFromTableCarrierConvertible<K, V, Default>,
		IToTableCarrierConvertible<K, V, Default> {}

/**
 * This is an interface for representing entities that are
 * `ITableCarrierConvertible<K, V, Default>`, as well as
 * capable of being turned into a modifiable form via
 * an `ITableMap`.
 */
export interface ILiquidMap<K = any, V = any, Default = any>
	extends ITableCarrierConvertible<K, V, Default>,
		IToModifiableConvertible<K, V, Default>,
		ICopiable {}

/**
 * This is an interface for representing a "table-carrier",
 * an entity representing a key-value table, with a default
 * value (returned for invalid read-operations), and a `.size: number`.
 * Data of table-carriers is intendced to be immutable.
 */
export interface ITableCarrier<K = any, V = any, Default = any>
	extends IDefaulting<Default>,
		ISizeable {
	readonly keys: readonly K[]
	readonly values: readonly V[]
	read: (i: number) => V | Default
}
