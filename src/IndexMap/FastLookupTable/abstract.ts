import type {
	Settable,
	KeyReplaceable,
	Deletable,
	HashMap
} from "../HashMap/interfaces.js"

import type { IndexAssignable } from "./interfaces.js"

import { DelegateDeletableSettableSizeable } from "../abstract.js"
import { assignIndex } from "./utils.js"

export abstract class DelegateLookupTable<
	KeyType = any,
	ValueType = any,
	OwningType = any,
	DeletedType = KeyType,
	DelegateType extends Settable<KeyType, ValueType> &
		KeyReplaceable<KeyType> &
		Deletable<DeletedType> = any
> extends DelegateDeletableSettableSizeable<KeyType, ValueType> {
	protected value: DelegateType

	replaceKey(keyFrom: KeyType, keyTo: KeyType) {
		this.value.replaceKey(keyFrom, keyTo)
		return this
	}

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
	KeyType,
	HashMap<KeyType, ValueType, any>
> {
	byOwned(priorOwned: IndexAssignable<OwningType>) {
		return this.value.index(priorOwned.assignedIndex)
	}

	constructor(hash: HashMap<KeyType, ValueType>) {
		super(hash)
	}
}
