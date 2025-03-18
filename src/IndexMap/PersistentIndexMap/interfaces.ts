import type { IPointer } from "../../Pattern/interfaces.js"
import type { IndexMap } from "../interfaces.js"

export type IPersistentIndexMap<
	KeyType = any,
	ValueType = any,
	DefaultType = any
> = IndexMap<KeyType, ValueType, DefaultType, IPointer<number>>
