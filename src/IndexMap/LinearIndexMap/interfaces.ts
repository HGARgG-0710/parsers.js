import type { IndexingFunction, IndexMap } from "../interfaces.js"

export interface LinearIndexMap<KeyType = any, ValueType = any, DefaulType = any>
	extends IndexMap<KeyType, ValueType, DefaulType> {
	change?: IndexingFunction<KeyType>
	keyExtension: Function
	extension: (x: any, ...y: any[]) => any
}
