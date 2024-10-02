import type { Pattern } from "src/Pattern/interfaces.js"
import type { IndexMap } from "../interfaces.js"
import type { SubHaving } from "../SubHaving/interfaces.js"

export interface PersistentIndexMap<KeyType = any, ValueType = any>
	extends IndexMap<KeyType, ValueType>,
		SubHaving<IndexMap<KeyType, ValueType>> {
	getIndex: (key: KeyType) => Pattern<number>
	indexes: Pattern<number>[]
}
