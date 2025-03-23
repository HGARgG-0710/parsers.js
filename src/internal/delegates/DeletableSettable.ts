import type { WeakDeletable, WeakSettable } from "../../IndexMap/refactor.js"
import type { ISizeable } from "../../interfaces.js"
import { DelegateSizeable } from "./Sizeable.js"

export abstract class DelegateDeletableSettableSizeable<
	KeyType = any,
	ValueType = any,
	DelegateType extends WeakDeletable<DeletedType> &
		WeakSettable<KeyType, ValueType | DefaultType> &
		ISizeable = any,
	DeletedType = KeyType,
	DefaultType = any
> extends DelegateSizeable<DelegateType> {
	set(key: KeyType, value: ValueType | DefaultType) {
		this.value.set(key, value)
		return this
	}

	delete(key: DeletedType) {
		this.value.delete(key)
		return this
	}
}
