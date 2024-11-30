import type { Pointer } from "../../Pattern/interfaces.js"
import type { HashMap, KeyReplaceable, Settable } from "../HashMap/interfaces.js"
import type { PersistentIndexMap } from "../PersistentIndexMap/interfaces.js"
import type { FastLookupTable, IndexAssignable } from "./interfaces.js"

import { current, extendClass } from "../../utils.js"

import { function as _f } from "@hgargg-0710/one"
import { assignIndex } from "./utils.js"
const { id } = _f

export abstract class DelegateLookupTable<
	KeyType = any,
	ValueType = any,
	OwningType = any,
	DelegateType extends Settable<KeyType, ValueType> & KeyReplaceable<KeyType> = any
> {
	protected value: DelegateType

	set(key: KeyType, value: ValueType) {
		this.value.set(key, value)
		return this
	}

	replaceKey(keyFrom: KeyType, keyTo: KeyType) {
		this.value.replaceKey(keyFrom, keyTo)
		return this
	}

	own(x: IndexAssignable<OwningType>, ownIndex: OwningType) {
		assignIndex(x, ownIndex)
		return x
	}

	constructor(value: DelegateType) {
		this.value = value
	}
}

export class PersistentIndexLookupTable<KeyType = any, ValueType = any>
	extends DelegateLookupTable<
		KeyType,
		ValueType,
		Pointer<number>,
		PersistentIndexMap<KeyType, ValueType>
	>
	implements FastLookupTable<KeyType, ValueType, Pointer<number>>
{
	getIndex(x: any) {
		return this.value.getIndex(x)
	}

	byOwned(priorOwned: IndexAssignable<Pointer<number>>): ValueType {
		return this.value.byIndex(priorOwned.assignedIndex.value)[1]
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
) {
	class HashTableClass
		extends DelegateLookupTable<
			KeyType,
			ValueType,
			OwningType,
			HashMap<KeyType, ValueType, any>
		>
		implements FastLookupTable<KeyType, ValueType, OwningType>
	{
		protected value: HashMap<KeyType, ValueType, any>

		getIndex: (x: any) => OwningType

		byOwned(priorOwned: IndexAssignable<OwningType>) {
			return this.value.index(priorOwned.assignedIndex)
		}

		delete(key: KeyType) {
			this.value.delete(key)
			return this
		}

		constructor(hash: HashMap<KeyType, ValueType>) {
			super(hash)
		}
	}

	HashTableClass.prototype.getIndex = ownership

	return HashTableClass
}

type HashConstructor = new <KeyType = any, ValueType = any>(
	hash: HashMap<KeyType, ValueType>
) => FastLookupTable<KeyType, ValueType>

export const [BasicHashTable, StreamHashTable]: [HashConstructor, HashConstructor] = [
	id,
	current
].map(HashTable) as [any, any]
