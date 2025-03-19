import type { IPointer } from "../../Pattern/interfaces.js"
import type { IIndexMap } from "../interfaces.js"

export type IPersistentIndexMap<
	KeyType = any,
	ValueType = any,
	DefaultType = any
> = IIndexMap<KeyType, ValueType, DefaultType, IPointer<number>>
