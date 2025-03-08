import type { Sizeable } from "src/interfaces.js"
import type { Rekeyable } from "src/interfaces.js"
import type { Deletable } from "src/interfaces.js"
import type { Settable } from "src/interfaces.js"

import { DelegateDeletableSettableSizeable } from "../abstract.js"

export abstract class DelegateKeyReplaceable<
	KeyType = any,
	ValueType = any,
	DelegateType extends Settable<KeyType, ValueType> &
		Rekeyable<KeyType> &
		Deletable<DeletedType> &
		Sizeable = any,
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
