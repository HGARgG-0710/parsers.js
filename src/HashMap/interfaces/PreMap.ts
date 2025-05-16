import type {
	ICopiable,
	IDefaulting,
	IDeletable,
	IRekeyable,
	ISettable,
	ISizeable
} from "../../interfaces.js"

export interface IPreMap<KeyType = any, ValueType = any, DefaultType = any>
	extends ISettable<KeyType, ValueType | DefaultType>,
		IDeletable<KeyType>,
		IRekeyable<KeyType>,
		ISizeable,
		IDefaulting<DefaultType>,
		ICopiable {
	get: (key: KeyType) => ValueType | DefaultType
}
