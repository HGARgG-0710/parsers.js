import type { Pattern } from "../../Pattern/interfaces.js"
import type { IndexMap } from "../interfaces.js"

export interface PersistentIndexMap<KeyType = any, ValueType = any>
	extends IndexMap<KeyType, ValueType, Pattern<number>>,
		Pattern<IndexMap<KeyType, ValueType>> {
	indexes: Pattern<number>[]
}
