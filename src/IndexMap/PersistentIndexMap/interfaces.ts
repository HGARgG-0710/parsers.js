import type { IPointer } from "src/interfaces.js"
import type { IIndexMap } from "../interfaces.js"

export type IPersistentIndexMap<
	KeyType = any,
	ValueType = any,
	DefaultType = any
> = IIndexMap<KeyType, ValueType, DefaultType, IPointer<number>>
