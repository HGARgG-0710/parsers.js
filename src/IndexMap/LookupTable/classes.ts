import type { IPointer } from "../../Pattern/interfaces.js"
import type { IPersistentIndexMap } from "../PersistentIndexMap/interfaces.js"
import type { IHashMap } from "../HashMap/interfaces.js"
import type {
	IRekeyable,
	IDeletable,
	ISettable,
	ISizeable, 
	IIndexAssignable
} from "../../interfaces.js"

import type { ILookupTable, ITableConstructor } from "./interfaces.js"

import { current } from "../../Stream/utils.js"
import { assignIndex, pos } from "../../utils.js"
import { makeDelegate } from "../../refactor.js"

import { DelegateKeyReplaceable } from "./abstract.js"

import { functional, object, type } from "@hgargg-0710/one"
const { id } = functional
const { extendPrototype } = object
const { ConstDescriptor } = object.descriptor
const { isNullary } = type

abstract class DelegateLookupTable<
	KeyType = any,
	ValueType = any,
	OwningType = any,
	DelegateType extends ISettable<KeyType, ValueType> &
		IRekeyable<KeyType> &
		IDeletable<DeletedType> &
		ISizeable = any,
	DeletedType = KeyType
> extends DelegateKeyReplaceable<
	KeyType,
	ValueType,
	DelegateType,
	DeletedType
> {
	own(x: IIndexAssignable<OwningType>, ownIndex: OwningType) {
		assignIndex(x, ownIndex)
		return x
	}

	isOwned(x: any) {
		return !isNullary(x.assignedIndex)
	}
}

abstract class DelegateHashTable<
		KeyType = any,
		ValueType = any,
		OwningType = any
	>
	extends DelegateLookupTable<
		KeyType,
		ValueType,
		OwningType,
		IHashMap<KeyType, ValueType, any>,
		KeyType
	>
	implements ILookupTable<KeyType, ValueType, OwningType>
{
	abstract getIndex: (x: any) => OwningType

	byOwned(priorOwned: IIndexAssignable<OwningType>) {
		return this.value.index(priorOwned.assignedIndex)
	}

	constructor(hash: IHashMap<KeyType, ValueType>) {
		super(hash)
	}
}

export class PersistentIndexLookupTable<
		KeyType = any,
		ValueType = any,
		DefaultType = any
	>
	extends DelegateLookupTable<
		KeyType,
		ValueType,
		IPointer<number>,
		IPersistentIndexMap<KeyType, ValueType, DefaultType>,
		any
	>
	implements ILookupTable<KeyType, ValueType, IPointer<number>>
{
	getIndex(x: any) {
		return this.value.getIndex(x)
	}

	byOwned(priorOwned: IIndexAssignable<IPointer<number>>): ValueType {
		return this.value.byIndex(priorOwned.assignedIndex!.value)[1]
	}

	delete(key: KeyType) {
		const { value } = this
		value.delete(value.getIndex(key).value)
		return this
	}
}

export function HashTable<OwningType = any>(
	ownership: (x: any) => OwningType
): ITableConstructor<OwningType> {
	const hashTable = makeDelegate(DelegateHashTable, "delegate")
	extendPrototype(hashTable, { getIndex: ConstDescriptor(ownership) })
	return hashTable as ITableConstructor<OwningType>
}

export const BasicTable = HashTable(id)

export const StreamTable = HashTable(current)

export const PosTable = HashTable(pos)
