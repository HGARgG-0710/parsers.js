import type { Defaulting } from "src/interfaces.js"
import type { Sizeable } from "src/interfaces.js"
import type { Rekeyable } from "src/interfaces.js"
import type { Deletable } from "src/interfaces.js"
import type { Settable } from "src/interfaces.js"

export interface IInternalHash<
	KeyType = any,
	ValueType = any,
	DefaultType = any
> extends Settable<KeyType, ValueType | DefaultType>,
		Deletable<KeyType>,
		Rekeyable<KeyType>,
		Sizeable,
		Defaulting<DefaultType> {
	get: (key: KeyType) => ValueType | DefaultType
}
