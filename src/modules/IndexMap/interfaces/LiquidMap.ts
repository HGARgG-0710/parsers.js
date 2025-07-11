import type { IDefaulting, ISizeable } from "../../../interfaces.js"
import type { ITableMap } from "./TableMap.js"

export interface ILiquidMap<K = any, V = any, Default = any> {
	toCarrier(): ITableCarrier<K, V, Default>
	toModifiable(): ITableMap<K, V, Default>
	fromCarrier(carrier: ITableCarrier<K, V, Default>): void
}

export interface ITableCarrier<K = any, V = any, Default = any>
	extends IDefaulting<Default>,
		ISizeable {
	readonly keys: readonly K[]
	readonly values: readonly V[]
	read: (i: number) => V | Default
}
