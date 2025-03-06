import type { IPointer } from "../../Pattern/interfaces.js"
import type { IndexMap } from "../interfaces.js"

export interface IPersistentIndexMap<KeyType = any, ValueType = any, DefaultType = any>
	extends IndexMap<KeyType, ValueType, DefaultType, IPointer<number>> {}
