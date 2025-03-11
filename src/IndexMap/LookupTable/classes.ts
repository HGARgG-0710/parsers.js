import type { IPointer } from "../../Pattern/interfaces.js"
import type { IPersistentIndexMap } from "../PersistentIndexMap/interfaces.js"
import type { LookupTable, TableConstructor } from "./interfaces.js"
import type { IndexAssignable } from "src/interfaces.js"
import type { Sizeable } from "src/interfaces.js"
import type {
	HashMap} from "../HashMap/interfaces.js"
import type { Rekeyable } from "src/interfaces.js"
import type { Deletable } from "src/interfaces.js"
import type { Settable } from "src/interfaces.js"

import { DelegateKeyReplaceable } from "./abstract.js"
import { current } from "src/Stream/utils.js"
import { pos } from "../../utils.js"
import { assignIndex } from "src/utils.js"

import { functional, object, type } from "@hgargg-0710/one"
const { id, copy } = functional
const { extendPrototype } = object
const { ConstDescriptor } = object.descriptor
const { isNullary } = type

abstract class DelegateLookupTable<
	KeyType = any,
	ValueType = any,
	OwningType = any,
	DelegateType extends Settable<KeyType, ValueType> &
		Rekeyable<KeyType> &
		Deletable<DeletedType> &
		Sizeable = any,
	DeletedType = KeyType
> extends DelegateKeyReplaceable<KeyType, ValueType, DelegateType, DeletedType> {
	own(x: IndexAssignable<OwningType>, ownIndex: OwningType) {
		assignIndex(x, ownIndex)
		return x
	}

	isOwned(x: any) {
		return !isNullary(x.assignedIndex)
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
	implements LookupTable<KeyType, ValueType, OwningType>
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
	implements LookupTable<KeyType, ValueType, IPointer<number>>
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

export function HashTable<OwningType = any>(
	ownership: (x: any) => OwningType
): TableConstructor<OwningType> {
	const HashTableClass = copy(DelegateHashTable) as TableConstructor<OwningType>
	extendPrototype(HashTableClass, { getIndex: ConstDescriptor(ownership) })
	return HashTableClass
}

export const [BasicTable, StreamTable, PosTable]: [
	TableConstructor,
	TableConstructor,
	TableConstructor
] = [id, current, pos].map(HashTable) as [any, any, any]
