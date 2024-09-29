import type { DefaultHaving, Sizeable } from "src/IndexMap/interfaces.js"
import type { Settable, Deletable } from "../interfaces.js"

export interface InternalHash<KeyType = any, ValueType = any>
	extends Settable<KeyType, ValueType>,
		Deletable<KeyType>,
		Sizeable,
		DefaultHaving {
	get: (key: KeyType) => ValueType
	replaceKey: (keyFrom: KeyType, keyTo: KeyType) => any
}
