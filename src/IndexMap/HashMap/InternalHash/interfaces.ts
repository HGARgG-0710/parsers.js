import type { DefaultHaving, Sizeable } from "src/IndexMap/interfaces.js"
import type { Settable, Deletable, KeyReplaceable } from "../interfaces.js"

export interface InternalHash<KeyType = any, ValueType = any>
	extends Settable<KeyType, ValueType>,
		Deletable<KeyType>,
		KeyReplaceable<KeyType>,
		Sizeable,
		DefaultHaving {
	get: (key: KeyType) => ValueType
}
