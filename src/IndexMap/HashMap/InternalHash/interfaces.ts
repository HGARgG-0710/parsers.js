import type { DefaultHaving, Sizeable } from "../../interfaces.js"
import type { Settable, Deletable, KeyReplaceable } from "../interfaces.js"

export interface InternalHash<KeyType = any, ValueType = any>
	extends Settable<KeyType, ValueType>,
		Deletable<KeyType>,
		KeyReplaceable<KeyType>,
		Sizeable,
		DefaultHaving {
	get: (key: KeyType) => ValueType
}

export type InternalHashConstructor<KeyType = any, ValueType = any, InputType = any> = new (
	input?: InputType,
	_default?: any
) => InternalHash<KeyType, ValueType>
