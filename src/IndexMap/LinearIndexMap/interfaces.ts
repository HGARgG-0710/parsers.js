import type { IndexingFunction, IndexMap } from "../interfaces.js"

export interface LinearIndexMap<KeyType = any, ValueType = any>
	extends IndexMap<KeyType, ValueType> {
	change?: IndexingFunction<KeyType>
	keyExtension: Function
	extension: Function
	alteredKeys: any[]
}
