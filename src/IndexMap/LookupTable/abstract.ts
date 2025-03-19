import type { ISizeable } from "src/interfaces.js"
import type { IRekeyable } from "src/interfaces.js"
import type { IDeletable } from "src/interfaces.js"
import type { ISettable } from "src/interfaces.js"

import { DelegateDeletableSettableSizeable } from "../abstract.js"

export abstract class DelegateKeyReplaceable<
	KeyType = any,
	ValueType = any,
	DelegateType extends ISettable<KeyType, ValueType> &
		IRekeyable<KeyType> &
		IDeletable<DeletedType> &
		ISizeable = any,
	DeletedType = KeyType
> extends DelegateDeletableSettableSizeable<
	KeyType,
	ValueType,
	DelegateType,
	DeletedType
> {
	protected value: DelegateType
	rekey(keyFrom: KeyType, keyTo: KeyType) {
		this.value.rekey(keyFrom, keyTo)
		return this
	}
}
