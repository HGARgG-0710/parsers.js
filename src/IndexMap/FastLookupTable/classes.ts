import type { Pointer } from "../../Pattern/interfaces.js"
import type {
	Deletable,
	HashMap,
	KeyReplaceable,
	Settable
} from "../HashMap/interfaces.js"
import type { PersistentIndexMap } from "../PersistentIndexMap/interfaces.js"
import type { FastLookupTable, IndexAssignable } from "./interfaces.js"
import type { Sizeable } from "../interfaces.js"

import { DelegateKeyReplaceable } from "./abstract.js"
import { current } from "src/Stream/utils.js"

import { copyFunction, extendPrototype } from "../../refactor.js"
import { assignIndex } from "./utils.js"

import { functional } from "@hgargg-0710/one"
const { id } = functional

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
		Pointer<number>,
		PersistentIndexMap<KeyType, ValueType>,
		any
	>
	implements FastLookupTable<KeyType, ValueType, Pointer<number>>
{
	getIndex(x: any) {
		return this.value.getIndex(x)
	}

	byOwned(priorOwned: IndexAssignable<Pointer<number>>): ValueType {
		return this.value.byIndex(priorOwned.assignedIndex!.value)[1]
	}

	delete(key: KeyType) {
		const { value } = this
		value.delete(value.getIndex(key).value)
		return this
	}

	constructor(table: PersistentIndexMap<KeyType, ValueType>) {
		super(table)
	}
}

export function HashTable<KeyType = any, ValueType = any, OwningType = any>(
	ownership: (x: any) => OwningType
): FastLookupTable<KeyType, ValueType, OwningType> {
	const HashTableClass = copyFunction(DelegateHashTable)
	extendPrototype(HashTableClass, { getIndex: { value: ownership } })
	return HashTableClass
}

type HashConstructor = new <KeyType = any, ValueType = any>(
	hash: HashMap<KeyType, ValueType>
) => FastLookupTable<KeyType, ValueType>

export const [BasicHashTable, StreamHashTable]: [HashConstructor, HashConstructor] = [
	id,
	current
].map(HashTable) as [any, any]
