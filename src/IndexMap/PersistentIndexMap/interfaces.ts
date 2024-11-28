import type { Pointer } from "../../Pattern/interfaces.js"
import type { IndexMap } from "../interfaces.js"

export interface PersistentIndexMap<KeyType = any, ValueType = any>
	extends IndexMap<KeyType, ValueType, Pointer<number>> {}
