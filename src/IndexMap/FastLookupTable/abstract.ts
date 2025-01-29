import type { Sizeable } from "../interfaces.js"
import type { Settable, KeyReplaceable, Deletable } from "../HashMap/interfaces.js"

import { DelegateDeletableSettableSizeable } from "../abstract.js"

export abstract class DelegateKeyReplaceable<
	KeyType = any,
	ValueType = any,
	DelegateType extends Settable<KeyType, ValueType> &
		KeyReplaceable<KeyType> &
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
	replaceKey(keyFrom: KeyType, keyTo: KeyType) {
		this.value.replaceKey(keyFrom, keyTo)
		return this
	}
}
