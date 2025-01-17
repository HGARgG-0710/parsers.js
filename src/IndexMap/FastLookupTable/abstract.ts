import type { Sizeable } from "../interfaces.js"
import type {
	Settable,
	KeyReplaceable,
	Deletable,
	HashMap
} from "../HashMap/interfaces.js"

import type { IndexAssignable } from "./interfaces.js"

import { DelegateDeletableSettableSizeable } from "../abstract.js"
import { assignIndex } from "./utils.js"

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

export abstract class DelegateLookupTable<
	KeyType = any,
	ValueType = any,
	OwningType = any,
	DelegateType extends Settable<KeyType, ValueType> &
		KeyReplaceable<KeyType> &
		Deletable<DeletedType> &
		Sizeable = any,
	DeletedType = KeyType
> extends DelegateKeyReplaceable<KeyType, ValueType, DelegateType, DeletedType> {
	own(x: IndexAssignable<OwningType>, ownIndex: OwningType) {
		assignIndex(x, ownIndex)
		return x
	}

	constructor(value: DelegateType) {
		super(value)
	}
}

export abstract class DelegateHashTable<
	KeyType = any,
	ValueType = any,
	OwningType = any
> extends DelegateLookupTable<
	KeyType,
	ValueType,
	OwningType,
	HashMap<KeyType, ValueType, any>,
	KeyType
> {
	byOwned(priorOwned: IndexAssignable<OwningType>) {
		return this.value.index(priorOwned.assignedIndex)
	}

	constructor(hash: HashMap<KeyType, ValueType>) {
		super(hash)
	}
}
