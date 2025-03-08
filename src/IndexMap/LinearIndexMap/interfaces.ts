import type { IndexMap } from "../interfaces.js"
import type { IndexingFunction } from "src/interfaces.js"

export interface ILinearIndexMap<KeyType = any, ValueType = any, DefaulType = any>
	extends IndexMap<KeyType, ValueType, DefaulType> {
	change?: IndexingFunction<KeyType>
	keyExtension: Function
	extension: (x: any, ...y: any[]) => any
}
