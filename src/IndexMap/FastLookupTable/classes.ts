import type { Pointer } from "../../Pattern/interfaces.js"
import type { HashMap } from "../HashMap/interfaces.js"
import type { PersistentIndexMap } from "../PersistentIndexMap/interfaces.js"
import type { FastLookupTable, IndexAssignable } from "./interfaces.js"

import { DelegateLookupTable, PreHashTableClass } from "./abstract.js"
import { current } from "src/Stream/utils.js"

import { functional } from "@hgargg-0710/one"
import { copyFunction, extendPrototype } from "../../refactor.js"
const { id } = functional

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
	const HashTableClass = copyFunction(PreHashTableClass)
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
