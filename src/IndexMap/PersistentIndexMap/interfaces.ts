import type { IIndexMap } from "../interfaces.js"
import type { IndexPointer } from "../../classes.js"

export type IPersistentIndexMap<
	KeyType = any,
	ValueType = any,
	DefaultType = any
> = IIndexMap<KeyType, ValueType, DefaultType, IndexPointer>
