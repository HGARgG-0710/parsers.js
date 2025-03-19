import type { IIndexMap } from "../interfaces.js"
import type { IIndexingFunction } from "src/interfaces.js"

export interface ILinearIndexMap<KeyType = any, ValueType = any, DefaulType = any>
	extends IIndexMap<KeyType, ValueType, DefaulType> {
	change?: IIndexingFunction<KeyType>
	keyExtension: Function
	extension: (x: any, ...y: any[]) => any
}
