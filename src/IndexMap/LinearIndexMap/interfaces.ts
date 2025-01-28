import type { IndexingFunction, IndexMap } from "../interfaces.js"

export interface LinearIndexMap<KeyType = any, ValueType = any>
	extends IndexMap<KeyType, ValueType> {
	change?: IndexingFunction<KeyType>
	keyExtension: Function
	extension: (x: any, ...y: any[]) => any
	alteredKeys: any[]
}
