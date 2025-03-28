import type {
	ISettable,
	IRekeyable,
	IDeletable,
	ISizeable
} from "../../interfaces.js"

import { DelegateDeletableSettableSizeable } from "./DeletableSettable.js"

export abstract class DelegateRekeyable<
	KeyType = any,
	ValueType = any,
	DelegateType extends ISettable<KeyType, ValueType> &
		IRekeyable<KeyType> &
		IDeletable<DeletedType> &
		ISizeable = any,
	DeletedType = KeyType,
	DefaultType = any
> extends DelegateDeletableSettableSizeable<
	KeyType,
	ValueType,
	DelegateType,
	DeletedType,
	DefaultType
> {
	rekey(keyFrom: KeyType, keyTo: KeyType) {
		this.value.rekey(keyFrom, keyTo)
		return this
	}
}
