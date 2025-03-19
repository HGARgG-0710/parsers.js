import type { IDefaulting } from "src/interfaces.js"
import type { ISizeable } from "src/interfaces.js"
import type { IRekeyable } from "src/interfaces.js"
import type { IDeletable } from "src/interfaces.js"
import type { ISettable } from "src/interfaces.js"

export interface IInternalHash<
	KeyType = any,
	ValueType = any,
	DefaultType = any
> extends ISettable<KeyType, ValueType | DefaultType>,
		IDeletable<KeyType>,
		IRekeyable<KeyType>,
		ISizeable,
		IDefaulting<DefaultType> {
	get: (key: KeyType) => ValueType | DefaultType
}
