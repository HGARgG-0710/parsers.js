import type { DefaultHaving, Sizeable } from "src/IndexMap/interfaces.js"
import type { Settable, Deletable, KeyReplaceable } from "../interfaces.js"
import type { Summat } from "@hgargg-0710/summat.ts"

export interface InternalHash<KeyType = any, ValueType = any>
	extends Settable<KeyType, ValueType>,
		Deletable<KeyType>,
		KeyReplaceable<KeyType>,
		Sizeable,
		DefaultHaving {
	get: (key: KeyType) => ValueType
}

export interface InternalHashClass<KeyType = any, ValueType = any, InputType = any>
	extends Summat {
	new (input?: InputType, _default?: any): InternalHash<KeyType, ValueType>
}
