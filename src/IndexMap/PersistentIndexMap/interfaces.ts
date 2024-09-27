import type { Pattern } from "src/Pattern/interfaces.js"
import type { IndexMap, StableIndexMap, VolatileIndexMap } from "../interfaces.js"

export type PersistentIndexValue<Value = any> = [Pattern<number>, Value]
export type UnderPersistentMap<KeyType = any, ValueType = any> = IndexMap<
	KeyType,
	PersistentIndexValue<ValueType>
>

export interface PersistentIndexMap<KeyType = any, ValueType = any>
	extends StableIndexMap<KeyType, PersistentIndexValue<ValueType>>,
		VolatileIndexMap<KeyType, ValueType> {
	indexMap: UnderPersistentMap<KeyType, ValueType>
}
