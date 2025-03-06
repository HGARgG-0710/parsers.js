import type { IPointer } from "../../Pattern/interfaces.js"
import type {
	Deletable,
	HashMap,
	KeyReplaceable,
	Settable
} from "../HashMap/interfaces.js"
import type { IPersistentIndexMap } from "../PersistentIndexMap/interfaces.js"
import type { FastLookupTable, IndexAssignable } from "./interfaces.js"
import type { Sizeable } from "../interfaces.js"

import { DelegateKeyReplaceable } from "./abstract.js"
import { current } from "src/Stream/utils.js"

import { assignIndex } from "./utils.js"

import { functional, object } from "@hgargg-0710/one"
const { id, copy } = functional
const { extendPrototype } = object
const { ConstDescriptor } = object.descriptor

abstract class DelegateLookupTable<
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

abstract class DelegateHashTable<KeyType = any, ValueType = any, OwningType = any>
	extends DelegateLookupTable<
		KeyType,
		ValueType,
		OwningType,
		HashMap<KeyType, ValueType, any>,
		KeyType
	>
	implements FastLookupTable<KeyType, ValueType, OwningType>
{
	abstract getIndex: (x: any) => OwningType

	byOwned(priorOwned: IndexAssignable<OwningType>) {
		return this.value.index(priorOwned.assignedIndex)
	}

	constructor(hash: HashMap<KeyType, ValueType>) {
		super(hash)
	}
}

export class PersistentIndexLookupTable<KeyType = any, ValueType = any>
	extends DelegateLookupTable<
		KeyType,
		ValueType,
		IPointer<number>,
		IPersistentIndexMap<KeyType, ValueType>,
		any
	>
	implements FastLookupTable<KeyType, ValueType, IPointer<number>>
{
	getIndex(x: any) {
		return this.value.getIndex(x)
	}

	byOwned(priorOwned: IndexAssignable<IPointer<number>>): ValueType {
		return this.value.byIndex(priorOwned.assignedIndex!.value)[1]
	}

	delete(key: KeyType) {
		const { value } = this
		value.delete(value.getIndex(key).value)
		return this
	}

	constructor(table: IPersistentIndexMap<KeyType, ValueType>) {
		super(table)
	}
}

export function HashTable<KeyType = any, ValueType = any, OwningType = any>(
	ownership: (x: any) => OwningType
): new () => FastLookupTable<KeyType, ValueType, OwningType> {
	const HashTableClass = copy(DelegateHashTable) as new () => FastLookupTable<
		KeyType,
		ValueType,
		OwningType
	>
	extendPrototype(HashTableClass, { getIndex: ConstDescriptor(ownership) })
	return HashTableClass
}

type HashConstructor = new <KeyType = any, ValueType = any>(
	hash: HashMap<KeyType, ValueType>
) => FastLookupTable<KeyType, ValueType>

export const [BasicTable, StreamTable]: [HashConstructor, HashConstructor] = [
	id,
	current
].map(HashTable) as [any, any]
