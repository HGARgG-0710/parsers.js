import type {
	IDefaulting,
	ISizeable,
	IRekeyable,
	IDeletable,
	ISettable
} from "../../../interfaces.js"

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
