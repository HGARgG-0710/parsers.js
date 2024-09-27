import type { Changing, IndexMap } from "../interfaces.js"

export interface LinearIndexMap<KeyType = any, ValueType = any>
	extends IndexMap<KeyType, ValueType>,
		Changing<KeyType> {}
