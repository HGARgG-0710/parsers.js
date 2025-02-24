import type { DefaultHaving, Sizeable } from "../../interfaces.js"
import type { Settable, Deletable, KeyReplaceable } from "../interfaces.js"

export interface InternalHash<KeyType = any, ValueType = any, DefaultType = any>
	extends Settable<KeyType, ValueType | DefaultType>,
		Deletable<KeyType>,
		KeyReplaceable<KeyType>,
		Sizeable,
		DefaultHaving<DefaultType> {
	get: (key: KeyType) => ValueType | DefaultType
}

export type InternalHashConstructor<
	KeyType = any,
	ValueType = any,
	InputType = any,
	DefaultType = any
> = new (input?: InputType, _default?: DefaultType) => InternalHash<
	KeyType,
	ValueType,
	DefaultType
>
